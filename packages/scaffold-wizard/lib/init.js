/* eslint-disable node/no-missing-require */
const fs = require('fs-extra');
const path = require('path');

module.exports = function init(templateName) {
  const packageJson = require(path.resolve('package.json'));
  const templatePath = path.dirname(require.resolve(`${templateName}/package.json`, { paths: [process.cwd()] }));
  const templateJson = require(`${templatePath}/template.json`);

  Object.assign(packageJson, templateJson);
  fs.writeJSONSync('./package.json', packageJson, { spaces: 2 });

  fs.copySync(path.join(templatePath, 'template'), './');
};
