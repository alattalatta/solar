/* eslint @typescript-eslint/no-var-requires: 0 */
const withTM = require('next-transpile-modules')(['fp-ts'])

module.exports = withTM({
  target: 'serverless',
  webpack(config) {
    config.resolve.alias['@'] = __dirname

    return config
  },
})
