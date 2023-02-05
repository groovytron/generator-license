modules.export = {
  extends: [
    "xo",
    "prettier"
  ],
  env: {
    "jest": true,
    "node": true
  },
  rules: {
    "object-shorthand": [
      "error",
      "consistent"
    ],
    "prettier/prettier": [
      "error",
      {
        "singleQuote": true,
        "printWidth": 90,
        "trailingComma": "none"
      }
    ]
  },
  plugins: [
    "prettier"
  ]
}
