const path = require("path");
const FileManagerPlugin = require("filemanager-webpack-plugin");

module.exports = {
  entry: "./src/client/main.ts",
  externals: {
    "alt-client": "commonjs alt-client",
    natives: "commonjs natives",
  },
  mode: "production",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        include: [path.resolve(__dirname, "src")],
      },
    ],
  },
  plugins: [
    new FileManagerPlugin({
      events: {
        onEnd: [
          {
            copy: [
              {
                source: path.join(__dirname, "src/client/login/html"),
                destination: path.join(
                  __dirname,
                  "../resources/lr/client/html"
                ),
              },
            ],
          },
        ],
      },
    }),
  ],
  output: {
    filename: "client.js",
    path: path.resolve(__dirname, "../resources/lr"),
  },
  resolve: {
    extensions: [".js", ".json", ".ts"],
  },
  target: "node",
};