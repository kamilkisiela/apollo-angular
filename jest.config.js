module.exports = () => ({
  "globals": {
    "ts-jest": {
      "tsConfigFile": "tsconfig.test.json"
    }
  },
  "moduleFileExtensions": [
    "js",
    "ts"
  ],
  "transform": {
    ".ts": "<rootDir>/node_modules/ts-jest/preprocessor.js"
  },
  "testRegex": "\\.spec\\.ts$",
  "roots": [
    "<rootDir>/tests"
  ],
  "browser": true,
  "verbose": true,
  "notify": true
});
