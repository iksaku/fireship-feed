module.exports = {
  entry: './src/index.mjs',
  target: 'web',
  mode: 'development',
  devtool: 'source-map',
  output: {
    filename: 'index.js',
    libraryTarget: 'commonjs2',
    sourceMapFilename: 'index.js.map',
  },
  optimization: {
    minimize: true,
  },
}
