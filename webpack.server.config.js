const path = require("path");

module.exports = {
  entry: "./src/server/main.ts",
  externals: {
    "alt-server": "commonjs alt-server",
    bcryptjs: "commonjs bcryptjs",
    typeorm: "commonjs typeorm",
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        include: [path.resolve(__dirname, "src/server/")],
      },
    ],
  },
  output: {
    filename: "server.js",
    path: path.resolve(__dirname, "resources/lr"),
  },
  resolve: {
    extensions: [".js", ".json", ".ts"],
  },
};