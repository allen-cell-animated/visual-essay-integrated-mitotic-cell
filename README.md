imsc-visual-essay
=================

## Structure
src/<br/>
&nbsp;&nbsp;&nbsp;&nbsp;[components/](src/components/README.md)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;[constants/](src/constants/README.md)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;[styles/](src/styles/README.md)<br/>
___


## Running locally
To run this application in development, run `$ ./gradlew start`. This will start `webpack-dev-server`, running by default
on the port specified in `webpack/constants.js`. To view, visit `http://localhost:{PORT}`. Webpack-dev-server will watch all relevant project files, and reload the browser
automatically when those files change.
___


## Build-time configuration:

| Env var | Default | Options |
| ------- |-------- |---------|
|`DEPLOYMENT_ENV`    | dev     | "dev", "staging", "production" |


Differences in builds by environment:

| Target | Sources Maps | Uglification | NODE_ENV === 'production' |
| ------ | ------------ | ------------ |  ------------------------- |
| dev    | true         | false |  false                     |
| staging| true         | false |  false                      |
| production| false      | true |  true                      |
___


## Deployment
Once built, Webpack outputs (e.g., index.html, JS and CSS files) are put into a tar archive, gzipped, and stored in
Artifactory in the `maven-snapshot-local` repo. From there, deployments involve: a) pulling a particular artifact (referenced by git tag) out of Artifactory
and b) copying the contents of the artifact to an S3 website bucket. For both staging and production deployments, these 
steps are captured in this project's Jenkinsfile and can be executed by setting the proper parameters for the Jenkins build.

### Staging deployment
From the Jenkins UI:
1. Go to this project's `master` branch pipeline page: https://jenkins.corp.alleninstitute.org/job/docker-images/job/docker-visual-essay-integrated-mitotic-cell/job/master/
2. Select "Build with Parameters" on the left-hand-side navigation menu.
3. Under the "JOB_TYPE" dropdown, select "DEPLOY_ARTIFACT".
4. Under the "DEPLOYMENT_TYPE" dropdown, select "staging".
5. In the "GIT_TAG" selectbox, select the tag of the artifact you want to deploy.
6. Hit "Build"

### Production deployment
Note: The final two steps require the AWS CLI as well as permissions on AWS to copy to the production S3 bucket and to run a Cloudfront invalidation.
See https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html for details on installing the AWS CLI.

From the Jenkins UI:
1. Go to this project's `master` branch pipeline page: https://jenkins.corp.alleninstitute.org/job/docker-images/job/docker-visual-essay-integrated-mitotic-cell/job/master/
2. Select "Build with Parameters" on the left-hand-side navigation menu.
3. Under the "JOB_TYPE" dropdown, select "PROMOTE_ARTIFACT".
4. Ignore the "DEPLOYMENT_TYPE" dropdown for now.
5. In the "GIT_TAG" selectbox, select the tag of the artifact you want to deploy.
6. Hit "Build".
7. Once the artifact promotion job has finished, return to the "Build with Parameters" page.
8. Under the "JOB_TYPE" dropdown, select "DEPLOY_ARTIFACT".
9. Under the "DEPLOYMENT_TYPE" dropdown, select "production".
10. In the "GIT_TAG" selectbox, select the tag of the artifact you want to deploy.
11. Hit "Build".
12. Run the script "staging-to-prod.sh" found in this repo's `scripts` directory. That will ensure that production assets are in sync with staging assets.
13. Run the script "bust-cloudfront-cache.sh" found in this repo's `scripts` directory. That will ensure Cloudfront is serving the newly deployed artifacts.
___
