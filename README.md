# Piyush's personal website

## Run on local dev (default: http://localhost:7999):

1. `cd personal_website`
2. `bun install`
3. `cp sample.env .env`
4. In .env, change `NODE_ENV=production` to `NODE_ENV=development`
5. `bun run start`

## Push to production:

1. `cd personal_website`
2. `bun install`
3. `cp sample.env .env`
4. In .env, change `NODE_ENV=development` to `NODE_ENV=production`
5. Push to github repo as a commit (github-pages.yml is config for github workflow to deploy to github pages)
6. OR `bun run deploy`

## Formatting code:

`bun run format`

## Lint code:

`bun run lint`
`bun run lint_fix`

## Dependencies:

- node >= 16
- Recommend nvm for managing node versions

## Other info

- Website runs on https://piyushdatta.com/personal_website/
- CNAME: https://piyushdatta.com
- Github pages: https://piyushdatta.github.io/
- Built with React, React-Router, Express, and Webpack

### Special thanks to Michael D'Angelo (https://github.com/mldangelo) for opensourcing the code for this website and letting anyone use it. The repo for most of this code is at: https://github.com/mldangelo/personal-site
