import webpack from "webpack";
import getWebpackConfig from "./webpack.config";

export function start() {
  const compiler = webpack(getWebpackConfig("development"));

  compiler.run((err, stats) => {
    if (err) {
      console.error(err);
      return;
    }

    const info = stats?.toJson();

    if (stats?.hasErrors()) {
      console.error(info?.errors);
    }

    if (stats?.hasWarnings()) {
      console.warn(info?.warnings);
    }
  });
}
