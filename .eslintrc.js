const config = {
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:react-hooks/recommended",
    "plugin:prettier/recommended"
  ],
  "globals": {
    "css": false,
    "JSX": true
  },
  "rules": {
    "global-require": 0,
    "quotes": 0,
    "no-case-declarations": 0,
    "no-unused-expressions": 0,
    "prefer-const": "off",
    "no-duplicate-imports": "off",
    "import/no-duplicates": "off",
    "no-return-assign": 0,
    "no-script-url": 0,
    "no-loop-func": 0,
    "no-undef": "off",
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/member-delimiter-style": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/consistent-type-assertions": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-call": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unsafe-member-access": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/no-unsafe-return": "off",
    "@typescript-eslint/restrict-plus-operands": "off",
    "@typescript-eslint/prefer-regexp-exec": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "react-hooks/exhaustive-deps": "off",
    "import/prefer-default-export": "off",
  },
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
  ignorePatterns: [
    '.eslintrc.js',
    '*.stories.*'
  ]
};

module.exports = config;
