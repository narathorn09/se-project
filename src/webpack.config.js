const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  // ... other configuration
  plugins: [
    // ... other plugins
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      reportFilename: "report.html",
    }),
  ],
};
