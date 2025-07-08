module.exports = {
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/assets/**',
    '!src/content/**',
    '!src/components/index.ts',
],
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
  transform: {
    ".(ts|tsx)": "ts-jest"
  },
  preset: 'ts-jest',
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/coverage",
    "package.json",
    "package-lock.json",
    "reportWebVitals.ts",
    "setupTests.ts",
    "/test/__mocks__",
    "<rootDir>/src/constant.ts",
  ],
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/test/__mocks__/fileMock.ts",
    "\\.(css|less|scss)$": "<rootDir>/test/__mocks__/styleMock.ts",
    '^components/(.*)$': '<rootDir>/src/components/$1',
    '^constant$': '<rootDir>/src/constant',
    '^utils/icons$': '<rootDir>/src/utils/icons',
    '^utils/formatOpeningHours$': '<rootDir>/src/utils/formatOpeningHours',
    '^utils/makeNotificationData$': '<rootDir>/src/utils/makeNotificationData',
    "^@app-shell/(.*)$": "<rootDir>/../app-shell/src/$1",
    "^@consumer-portal/(.*)$": "<rootDir>/../consumer-portal/src/$1",
  }
};