# Piyush's personal website

## Run on local dev (default: http://localhost:7999):

1. `cd personal_website`
2. `npm install`
3. `cp sample.env .env`
4. In .env, change `NODE_ENV=production` to `NODE_ENV=development`
5. `npm lint_start`

## Push to production:

1. `cd personal_website`
2. `npm install`
3. `cp sample.env .env`
4. In .env, change `NODE_ENV=development` to `NODE_ENV=production`
5. Push to github repo as a commit (github-pages.yml is config for github workflow to deploy to github pages)
6. OR `npm run deploy`

## Formatting code:

`npm run format`

## Lint code:

`npm run lint`
`npm run lint_fix`

## Dependencies:

- node >= 16
- Recommend nvm for managing node versions

## Other info

- Website runs on https://piyushdatta.com/personal_website/
- CNAME: https://piyushdatta.com
- Github pages: https://piyushdatta.github.io/
- Built with React, React-Router, Express, and Webpack

### Special thanks to Michael D'Angelo (https://github.com/mldangelo) for opensourcing the code for this website and letting anyone use it. The repo for most of this code is at: https://github.com/mldangelo/personal-site
