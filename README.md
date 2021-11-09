<p align="center">
  <a href="https://www.selfcommunity.com/" rel="noopener" target="_blank">
    <img width="150" src="https://make.selfcommunity.com/assets/images/logo.png" alt="SelfCommunity logo">
  </a>
</p>

<h1 align="center">Community UI</h1>

<div align="center">

Quickly build beautiful community with SelfCommunity.
A set of React components UI to use to integrate a community.

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/selfcommunity/community-ui/blob/master/LICENSE)
[![npm latest package](https://img.shields.io/npm/v/@selfcommunity/latest.svg)](https://www.npmjs.com/package/@selfcommunity/community-ui)
[![Downloads][downloads-image]][downloads-url]
[![Follow on Twitter URL](https://img.shields.io/twitter/url/https/twitter.com/community_self.svg?style=social&label=Follow%20%40SelfCommunity)](https://twitter.com/community_self)

</div>

## Installation

CommunityUI is available as an [npm package](https://www.npmjs.com/package/@selfcommunity/community-ui).

First install peer dependencies needed to make the library work: 

```sh
// with npm
`npm install @mui/material @@emotion/react @emotion/styled react-intl`

// with yarn
`yarn add @mui/material @@emotion/react @emotion/styled react-intl`
```

Based on which package you want to install proceed as follows:

Install sc-core:

```sh
// with npm
`npm install @selfcommunity/i18n @selfcommunity/core`

// with yarn
`yarn add @selfcommunity/i18n @selfcommunity/core`
```

Install sc-ui package:

```sh
// with npm
`npm install @selfcommunity/i18n @selfcommunity/core @selfcommunity/ui`

// with yarn
`yarn add @selfcommunity/i18n @selfcommunity/core @selfcommunity/ui`
```

Install sc-templates package:

```sh
// with npm
`npm install @selfcommunity/i18n @selfcommunity/core @selfcommunity/templates`

// with yarn
`yarn add @selfcommunity/i18n @selfcommunity/core @selfcommunity/templates`
```

Install sc-i18n:

```sh
// with npm
`npm install @selfcommunity/i18n`

// with yarn
`yarn add @selfcommunity/i18n`
```

## Usage

Here is a quick example to get you started, **it's all you need**:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import {SCContextProvider} from '@selfcommunity/core';
import {PeopleSuggestion} from '@selfcommunity/ui';

function App() {
  const conf = {
    portal: '<community-path>',
    session: {
      type: 'OAuth',
      token: '<community-token>',
      refreshToken: '<community-refresh-token>',
      refreshTokenEndpoint: '<community-refresh-endpoint>',
    },
  };
  return (
    <SCContextProvider conf={conf}><PeopleSuggestion /></SCContextProvider>
  );
}

ReactDOM.render(<App />, document.querySelector('#app'));
```

## Local development

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
- sc-i18n

### sc-core
Groups core components.

### sc-ui
Contains all atomic components usefull to integrate a community in a frontend service context.
Some components use sc-core components, so sc-core is list between dependencies.
Requiring an sc-core component from this package, use the exact code currently located inside the project rather than
what is published on npm.

### sc-templates
Contains full community pages components usefull to integrate a community in a frontend service context.

### sc-ui
Contains i18n.


## Environment variables
Use .env files to change Storybook's behavior in different modes.
Add a .env.development or .env.production to apply different values to your environment variables.
Copy the content of .env.example in .env.development and .env.production and set the values.

## Required to run the monorepo
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

