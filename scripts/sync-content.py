import argparse
import datetime
import getpass
import json
import logging
import pathlib
import shlex
import socket
import subprocess
import sys
import traceback
import threading


###############################################################################

logging.basicConfig(
    level=logging.ERROR, format="[%(levelname)4s:%(filename)s %(lineno)4s %(asctime)s] %(message)s"
)
log = logging.getLogger()

###############################################################################

# Defaults
IMSC_CONTENT_ROOT = "/allen/aics/animated-cell/Dan/april2019mitotic/visual_essay_assets"
S3_STAGING_BUCKET = "s3://staging.imsc-visual-essay.allencell.org"
S3_ASSETS_PREFIX = "assets"
TIMEOUT = 60 * 5  # in seconds


class Args(argparse.Namespace):

    def parse(self, args=None):
        self.__parse(args)
        return self

    def __parse(self, args=None):
        parser = argparse.ArgumentParser(
            description="Synchronize IMSC assets between local directory source-of-truth and S3 bucket"
        )
        parser.add_argument(
            "-d",
            "--debug",
            action="store_true",
            dest="debug"
        )
        parser.add_argument(
            "-l",
            "--local-content-path",
            action="store",
            default=IMSC_CONTENT_ROOT,
            dest="from_path",
            help="Full path to directory with assets to sync with S3 bucket",
            type=str
        )
        parser.add_argument(
            "-b",
            "--bucket",
            action="store",
            default=S3_STAGING_BUCKET,
            dest="dest_bucket",
            help="S3 bucket to copy assets into",
            type=str
        )
        parser.add_argument(
            "-p",
            "--prefix",
            action="store",
            default=S3_ASSETS_PREFIX,
            dest="obj_prefix",
            help="S3 obj prefix. Should NOT start with a forward slash.",
            type=str
        )

        parser.parse_args(args=args, namespace=self)


def set_lockfile(lockfile_path: pathlib.Path):
    """
    Set a lockfile in from_path indicating this script is actively running. If the script is run twice,
    it should fail indicating who is running this script, when it was started, and on which host it is running.
    """
    log.debug("Setting watcher lockfile")

    lockfile_path.touch(exist_ok=False)

    info = {
        "host": socket.getfqdn(),
        "user": getpass.getuser(),
        "date_started": str(datetime.datetime.now())
    }
    lockfile_path.write_text(json.dumps(info, indent=4))


def remove_lockfile(lockfile_path: pathlib.Path):
    log.debug(f"Removing lockfile ({lockfile_path})")
    lockfile_path.unlink()


# a global var in this script; set in run_sync and potentially used to cancel a pending call in main exception handler
current_timer = None


def cancel_current_timer():
    global current_timer

    if current_timer:
        log.debug("Cancelling scheduled sync.")
        current_timer.cancel()


def run_sync(content_path: str, bucket_path: str, exclude_pattern=None):
    global current_timer

    log.debug(f"Running content sync from {content_path} to {bucket_path}")

    # sync contents from local content_path to bucket_path
    # if anything exists under the bucket_path that is not in content_path, remove it
    command = shlex.split(f"aws s3 sync {content_path} {bucket_path} --delete")

    if exclude_pattern:
        command = command + ["--exclude", exclude_pattern]

    completed_process = subprocess.run(command, capture_output=True, check=True)  # let calling func handle error
    output = completed_process.stdout.splitlines()

    if len(output):
        log.debug("Sync successful -- content uploaded to S3:")
        for line in output:
            log.debug(line)
    else:
        log.debug("Sync successful -- no content needed uploading")

    # call itself over and over again forever until keyboard interrupt
    current_timer = threading.Timer(TIMEOUT, run_sync, args=[content_path, bucket_path, exclude_pattern])
    current_timer.start()


class AlreadyRunningError(Exception):
    pass


def main():
    args = Args().parse()
    if args.debug:
        log.setLevel(logging.DEBUG)

    lockfile = pathlib.Path(args.from_path) / ".watcher-lock"

    try:
        log.debug("Running IMSC content sync watcher")

        if lockfile.exists():
            raise AlreadyRunningError(f"This process is already running:\n{lockfile.read_text()}")

        # set lockfile
        set_lockfile(lockfile)

        bucket_path = f"{args.dest_bucket}/{args.obj_prefix}"

        run_sync(args.from_path, bucket_path, exclude_pattern=f"{lockfile.name}")

        # threading.Timer does its own exception handling, so if exception is thrown after the
        # initial run of run_sync, it will not hit the exception handlers of this try block
        remove_lockfile(lockfile)
        cancel_current_timer()

    except AlreadyRunningError as e:
        log.error(e)
        sys.exit(1)

    except KeyboardInterrupt:
        remove_lockfile(lockfile)
        cancel_current_timer()

        # no need to print info about why script is exiting if it is explicitly killed
        sys.exit(1)

    except Exception as e:
        remove_lockfile(lockfile)
        cancel_current_timer()

        log.error("=============================================")
        log.error("\n\n" + traceback.format_exc())
        log.error("=============================================")
        sys.exit(1)


if __name__ == "__main__":
    main()
