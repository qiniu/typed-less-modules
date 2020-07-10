module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts?(x)"],
  testPathIgnorePatterns: [
    "<rootDir>/dist/",
    "<rootDir>/node_modules/",
    "(.*).d.ts"
  ],
  collectCoverage: true,
  collectCoverageFrom: ["lib/**/*.(ts|tsx)", "!**/node_modules/**"],
  coverageDirectory: "__coverage__",
  coverageReporters: ["json", "lcov", "text", "cobertura"]
};
