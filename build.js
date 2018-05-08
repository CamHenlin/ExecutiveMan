var compressor = require('node-minify');
var buildLevel = require('./leveljson/makelevel').buildLevel;

buildLevel('demo', 0);
buildLevel('accountingman', 7);
buildLevel('materialman', 8);
buildLevel('visionaryman', 8);
buildLevel('warehouseman', 0);
buildLevel('wasteman', 6);
buildLevel('hrman', 0);
buildLevel('itman', 0);
buildLevel('salesman', 0);

compressor.minify({
    compressor: 'no-compress',
    input: ['./libs/*.js', './levels/*.js', './objects/*.js', './enemies/*.js', './mechanics/*.js' ],
    output: 'game.js',
    callback: function (err, min) {}
});

compressor.minify({
  compressor: 'uglifyjs',
  input: ['./libs/*.js', './levels/*.js', './objects/*.js', './enemies/*.js', './mechanics/*.js' ],
  output: 'game.min.js',
  callback: function (err, min) {}
});