# Community UI

[![NPM version][npm-image]][npm-url]
[![Downloads][downloads-image]][downloads-url]

A set of React components UI to use to integrate a community.

### Install

Install sc-core and sc-ui packages:
`npm install @selfcommunity/core @selfcommunity/ui`

Install sc-templates package:
`npm install @selfcommunity/template`

### Local development

Community UI library uses a "monorepo" organization style for managing multiple npm packages in a single git repo. 
This is done through a [Yarn](https://yarnpkg.com/en/) feature called workspaces. 
It allows you to setup multiple packages in such a way that you only need to run yarn install once to install all of 
them in a single pass. Some workspaces depends on other workspace and in this way ensure all using the most up-to-date 
code available. With a root command yarn install, all workspaces dependencies will be installed together. 
A single lockfile is unique for all workspaces. Common dependencies will be correctly deduped and put at the root of 
the project.
This projects use also lerna, a tool that use yarn workspaces to manage multi packages operation.

This repo contains this workspaces:
- sc-core
- sc-ui
- sc-templates 

#### sc-core
Groups core components.

#### sc-ui
Contains all atomic components usefull to integrate a community in a frontend service context.
Some components use sc-core components, so sc-core is list between dependencies.
Requiring an sc-core component from this package, use the exact code currently located inside the project rather than 
what is published on npm.

#### sc-templates
Contains full community pages components usefull to integrate a community in a frontend service context.

### Environment variables
Use .env files to change Storybook's behavior in different modes.
Add a .env.development or .env.production to apply different values to your environment variables.
Copy the content of .env.example in .env.development and .env.production and set the values.

### Required to run the monorepo 
To get everything setup and dependencies installed:

- make sure you have the **latest** version of yarn installed
- run `yarn bootstrap` in the repo root directory

### Running Storybook

- Follow the steps above
- `yarn storybook` to start storybook

[npm-image]: https://img.shields.io/npm/v/communityui.svg?style=flat-square
[npm-url]: https://npmjs.org/package/communityui
[downloads-image]: https://img.shields.io/npm/dm/communityui.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/communityui
