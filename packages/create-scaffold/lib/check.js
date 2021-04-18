/* eslint-disable no-process-exit */
const semver = require('semver');
const { execSync } = require('child_process');
const validateNpmPackageName = require('validate-npm-package-name');
const chalk = require('chalk');
const fs = require('fs-extra');
const packageJson = require('../package.json');

function checkNodeVersion() {
  if (!semver.satisfies(process.versions.node, packageJson.engines.node)) {
    console.error(
      chalk.red`${packageJson.name} requires Node version ${packageJson.engines.node}, but current Node version is ${process.versions.node}`
    );

    process.exit(1);
  }
}

function checkCliVersion() {
  try {
    const version = execSync(`npm view ${packageJson.name} version`).toString().trim();

    if (version !== packageJson.version) {
      console.log(chalk.red`${packageJson.name} is not the latest version!`);
      console.log(`current version is ${chalk.yellow(packageJson.version)}`);
      console.log(`latest version is ${chalk.yellow(version)}`);
      console.log('Please try:');
      console.log(chalk.cyan`npx ${packageJson.name} ${chalk.green('<project-directory>')} [options]`);
      console.log('or');
      console.log(
        chalk.cyan`npx --ignore-existing ${packageJson.name} ${chalk.green('<project-directory>')} [options]`
      );
    } else {
      return;
    }
  } catch (err) {
    console.error(err);
  }
  process.exit(1);
}

function checkNpmRegistry() {
  const required = 'https://registry.npmjs.org/';

  try {
    const registry = execSync('npm get registry').toString().trim();

    if (registry !== required) {
      console.log(chalk.red`${packageJson.name} requires npm registry ${required}`);
      console.log(chalk.red`current npm registry is ${registry}`);
    } else {
      return;
    }
  } catch (err) {
    console.error(err);
  }
  process.exit(1);
}

function checkAppName(name) {
  const result = validateNpmPackageName(name);

  if (result.validForNewPackages) {
    return;
  }

  console.error(chalk.red`project name ${name} is invalid`);
  [...(result.errors || []), ...(result.warnings || [])].forEach(error => console.error(chalk.red(error)));

  process.exit(1);
}

function checkAppDirectory(appPath, projectName) {
  console.log(`Creating a new app in ${chalk.green(appPath)}`);
  fs.ensureDirSync(appPath);

  const validFileNames = ['.git', '.gitignore', '.gitattributes', 'LICENSE', 'README.md'];
  const conflicts = fs.readdirSync(appPath).filter(name => !validFileNames.includes(name));

  if (conflicts.length > 0) {
    console.log(chalk.yellow`some files/folders in ${projectName} directory may cause conflicts`);
    conflicts.forEach(name => {
      console.log(`- ${name}`);
    });
    console.log(chalk.yellow('remove these or try a new name'));
    process.exit(1);
  }
}

module.exports = { checkNodeVersion, checkNpmRegistry, checkAppName, checkAppDirectory, checkCliVersion };
