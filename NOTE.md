Config eslintrc.json with tsconfig.json
# install the basics
npm i -D @typescript-eslint/parser @typescript-eslint/eslint-plugin

# support tsconfig baseUrl and paths
npm i -D eslint-plugin-import eslint-import-resolver-typescript
Then in the eslintrc, here in json:
{
"settings": {
"import/resolver": {
"typescript": {}
}
},
"parser": "@typescript-eslint/parser",
"parserOptions": {
"project": "./tsconfig.json",
"tsconfigRootDir": "./"
},
"plugins": [
"@typescript-eslint",
"import"
],
"extends": [
"plugin:@typescript-eslint/recommended",
"plugin:@typescript-eslint/recommended-requiring-type-checking"
]
}
