const path = require('path');

module.exports = {
  style: {
    sass: {
      loaderOptions: {
        sassOptions: {
          includePaths: [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, 'src'),
          ],
        },
      },
    },
  },
}; 