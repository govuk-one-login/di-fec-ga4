import path from "path";
import { fileURLToPath } from "url";
import TerserPlugin from "terser-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const config = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist/lib"),
    filename: "analytics.js",
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "./src/components", to: "../components" }, //nunjuck components
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.ts(x)?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            preamble:
              "/* eslint-disable no-console,no-useless-escape, no-unused-vars */",
            comments: false,
          },
        },
      }),
    ], //eslint-disable no-console
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
export default config;
