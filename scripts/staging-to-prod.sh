#!/usr/bin/env bash

##################################################
# Move assets from staging bucket to prod bucket #
##################################################

set -e

STAGING_BUCKET=s3://staging.imsc-visual-essay.allencell.org
PROD_BUCKET=s3://production.imsc-visual-essay.allencell.org
ASSET_PREFIX=assets

# sync prod bucket (target) with staging bucket (source)
aws s3 sync ${STAGING_BUCKET} ${PROD_BUCKET} --exclude "*" --include "$ASSET_PREFIX/*" --delete
