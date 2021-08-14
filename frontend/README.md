# Mad Liberation JS

The front-end for Mad Liberation.

## Run tests

`npm run-script test -- --watch`

If running on Mac, and you encounter an error like `Error: EMFILE: too many open files, watch`, you may need to run

`brew update`
`brew install watchman`

Details [here](https://github.com/facebook/create-react-app/issues/4540).

## Run locally

`REACT_APP_MLJSAPI_URL` must be specified, for example like `REACT_APP_MLJSAPI_URL=http://localhost:4001/`. Scripts running on localhost cannot make API calls to the production API.

### Run app

`REACT_APP_MLJSAPI_URL=<Mad Liberation API URL> npm start`
for example:
`REACT_APP_MLJSAPI_URL=http://localhost:4001 npm start`
or
`REACT_APP_MLJSAPI_URL=http://localhost:4001 PORT=4000 npm start`

I'm trying to generally use 4000 for MLJS, and 4001 for MLJSAPI, in local development.

### Run integration tests

`REACT_APP_MLJSAPI_URL=<Mad Liberation API URL> npm start`
`node ./src/App.itest.js --site http://localhost:3000`
