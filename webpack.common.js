const path = require('path');

module.exports = {
  entry: {
    app: './js/snake.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: './js/snake.js',
  },
};
