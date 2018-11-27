module.exports = {
  moduleFileExtensions: ['js', 'jsx'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  testMatch: [
    '<rootDir>/(__test__/**/*.spec.(js|jsx)|**/__test__/*.(js|jsx|ts|tsx))'
  ],
  transformIgnorePatterns: ['/node_modules/', '<rootDir>/lib/'],
  setupTestFrameworkScriptFile: '<rootDir>/__test__/setup.js'
}
