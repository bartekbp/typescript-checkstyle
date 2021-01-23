module.exports = {
  preset: 'ts-jest',
  rootDir: 'src',
  testEnvironment: 'node',
  setupFilesAfterEnv: [
    '../node_modules/jest-xml-matcher/index.js'
  ]
};