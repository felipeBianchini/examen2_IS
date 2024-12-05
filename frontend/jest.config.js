module.exports = {
    testEnvironment: "jsdom",
    moduleFileExtensions: ["js", "json", "vue"],
    transform: {
      "^.+\\.vue$": "vue-jest",
      "^.+\\.js$": "babel-jest"
    },
    testMatch: ["**/*.spec.[jt]s?(x)"],
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1"
    }
  };
  