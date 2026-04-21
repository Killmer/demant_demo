const nextJest = require("next/jest");

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/cypress/"],
  // Mirrors tsconfig baseUrl: "src" — allows bare imports like `components/Button`
  moduleDirectories: ["node_modules", "<rootDir>/src"],
  moduleNameMapper: {
    // Override next/jest's SVG fileMock (which returns an object) with a React component mock
    "^.+\\.(svg)$": "<rootDir>/__mocks__/svgMock.js",
    // Support explicit `src/` prefix (e.g. jest.mock("src/components/..."))
    "^src/(.*)$": "<rootDir>/src/$1",
    // tsconfig path aliases not covered by moduleDirectories (baseUrl)
    "^@helpers/(.*)$": "<rootDir>/tests/utils/$1",
    "^@fixtures/(.*)$": "<rootDir>/tests/fixtures/$1",
  },
};

module.exports = createJestConfig(config);
