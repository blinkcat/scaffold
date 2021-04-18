#!/usr/bin/env node
const { Command } = require('commander');
const program = new Command();
const chalk = require('chalk');
const path = require('path');
const fs = require('fs-extra');
const { execSync } = require('child_process');
const semver = require('semver');
const { checkNodeVersion, checkAppName, checkAppDirectory, checkNpmRegistry, checkCliVersion } = require('./lib/check');
const packageJson = require('./package.json');

let projectName = null;

checkNodeVersion();
// checkCliVersion();

program
  .name(packageJson.name)
  .version(packageJson.version)
  .arguments('[project-directory]')
  .usage(chalk.green('<project-directory>') + ' [options]')
  .addHelpText('after', () => {
    console.log();
    console.log('For example:');
    console.log(`${chalk.cyan(program.name())} ${chalk.green('my-app')}`);
  })
  .action(name => {
    projectName = name;
  })
  .option('--info', 'print environment debug info')
  .option('--wizard <wizard-version-or-path>', 'select a wizard')
  .option('--template <template-version-or-path>', 'select a project template')
  .parse(process.argv);

console.log(projectName, program.opts());

init();

function init() {
  if (projectName == null) {
    console.log(chalk.red('you must provide project directory!'));
    return;
  }

  const root = path.resolve(projectName);
  const appName = path.basename(root);

  checkAppName(appName);
  // checkNpmRegistry();
  checkAppDirectory(root, projectName);
  const options = program.opts();
  create(process.cwd(), path.resolve(projectName), appName, options.wizard, options.template);
}

function create(originalDirectory, projectRootPath, appName, wizard, template) {
  fs.writeJSONSync(
    path.resolve(projectRootPath, 'package.json'),
    {
      name: appName,
      version: '0.1.0',
      private: true,
    },
    { spaces: 2 }
  );

  const wizardPackage = getPackage(wizard, originalDirectory, 'scaffold-wizard');
  const templatePackage = getPackage(template, originalDirectory, 'scaffold-template');

  const dependencies = [wizardPackage, templatePackage];

  console.log(`install ${wizardPackage} and ${templatePackage} ...`);

  execSync(`npm install ${dependencies.join(' ')} -S`, {
    cwd: projectRootPath,
    stdio: 'inherit',
  });

  const wizardPkgName = getPackageName(wizardPackage);
  const templatePkgName = getPackageName(templatePackage);
  const script = `'require("${wizardPkgName}/lib/init.js").apply(null, JSON.parse(process.argv[1]));'`;

  execSync(`${process.execPath} -e ${script} -- '${JSON.stringify([templatePkgName])}'`, {
    cwd: projectRootPath,
    stdio: 'inherit',
  });
}
/**
 * get package name
 *
 * @param {string} pkg
 * @returns {string}
 */
function getPackageName(pkg) {
  if (/^file:/.test(pkg)) {
    return require(path.resolve(`${pkg.replace('file:', '')}`, 'package.json')).name;
  } else if (pkg.indexOf('@')) {
    return pkg.split('@')[0];
  } else {
    return pkg;
  }
}

/**
 * get package install path
 *
 * - 1.0.0
 * - cumstom-wizard
 * - file:./wizard
 *
 * @param {string} wizard
 * @param {string} originalDirectory
 * @param {string} defaultPackage
 * @returns {string}
 */
function getPackage(wizard, originalDirectory, defaultPackage) {
  let package = '';
  const version = semver.valid(wizard);

  if (version) {
    package += `@${version}`;
  } else if (/^file:/.test(wizard)) {
    package = `file:${path.resolve(originalDirectory, wizard.match(/^file:(.+)$/)[1])}`;
  } else {
    package = defaultPackage;
  }

  return package;
}
