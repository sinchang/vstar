const path = require('path')

module.exports = options => ({
  port: 5000,
  postcss: [
    // add more postcss plugins here
    // by default we have autoprefixer pre added
  ],
  webpack(config) {
    config.resolve.modules.push(path.resolve('src'))

    return config
  }
})
