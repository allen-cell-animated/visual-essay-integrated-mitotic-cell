imsc-visual-essay
=================

## Structure
src/<br/>
&nbsp;&nbsp;&nbsp;&nbsp;[components/](src/components/README.md)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;[constants/](src/constants/README.md)<br/>
&nbsp;&nbsp;&nbsp;&nbsp;[styles/](src/styles/README.md)<br/>
___


## Running locally
To run this application in development, run `$ npm install` then `$ npm start`. This will start `webpack-dev-server`, running by default
on the port specified in `webpack/constants.js`. To view, visit `http://localhost:{PORT}`. Webpack-dev-server will watch all relevant project files, and reload the browser
automatically when those files change.

#### Note (9/13/2021)
If you run into `EINTEGRITY` errors and/or TypeScript errors upon `npm install` or `npm start` (before having made any local changes to the code), you may need to configure npm to install dependencies from the AICS Artifactory (in `~/.npmrc`). If that doesn't work, you may also need to run the application in a node v10.5.0 environment. If we want to continue to develop this application and/or make it available for community contributions in the future, we should update the dependencies as they are rather outdated.

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

### Staging deployment
Any commits to the `main` branch are automatically deployed to staging.

### Production deployment
On `main` branch
1. Make a new version: `npm version [patch/minor/major]`
2. Push the new package.json version: `git push origin main`
3. Push the new tag: `git push origin [NEW_TAG]`
This will trigger a github workflow which copies the assets from the staging bucket into the production bucket.

___
