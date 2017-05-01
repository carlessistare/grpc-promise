module.exports = {
  "env": {
    "es6": true,
    "node": true,
    "mocha": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "sourceType": "module"
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ],
    "func-call-spacing": [
      "error",
      "never"
    ],
    "func-style": [
      "error",
      "expression"
    ],
    "space-before-function-paren": [
      "error",
      "always"
    ],
    "space-before-blocks": "error",
    "space-in-parens": [
      "error",
      "never"
    ],
    "spaced-comment": [
      "error",
      "always"
    ],
    "comma-style": [
      "error",
      "last"
    ],
    "brace-style": "error",
    "eol-last": [
      "error",
      "always"
    ],
    "func-call-spacing": [
      "error",
      "never"
    ],
    "arrow-body-style": [
      "error",
      "as-needed"
    ],
    "arrow-parens": [
      "error",
      "as-needed"
    ],
    "arrow-spacing": "error",
    "no-console": [
      "error", { "allow": [
        "warn",
        "error"
      ]}
    ]
  }
};