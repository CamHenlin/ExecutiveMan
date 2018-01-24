var compressor = require('node-minify');

compressor.minify({
    compressor: 'no-compress',
    input: ['./libs/*.js', './levels/*.js', './objects/*.js', './enemies/*.js', './mechanics/*.js' ],
    output: 'game.js',
    callback: function (err, min) {}
  });