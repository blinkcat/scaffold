import webapck from "webpack";
import path from "path";

const appSrcPath = path.resolve(process.cwd(), "src");

export default function (
  env: "development" | "test" | "production"
): webapck.Configuration {
  return {
    mode: "development",
    entry: path.resolve(appSrcPath, "index"),
    module: {
      rules: [
        {
          test: /\.(jsx?|tsx?)$/,
          include: appSrcPath,
          loader: "babel-loader",
          options: {
            presets: [require.resolve("babel-preset-scaffold")],
            cacheDirectory: true,
          },
        },
      ],
    },
    output: {
      path: path.resolve(appSrcPath, "../dist"),
      filename: "main.js",
    },
  };
}
