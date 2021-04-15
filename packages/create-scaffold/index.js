const { Command } = require('commander');
const program = new Command();
const semver = require('semver');
const packageJson = require('./package.json');

let projectName = null;

checkCurrentNodeVersion();

/**
 * 使用方法
 * create-scaffold <direcotry> [options]
 */
program
  .name(packageJson.name)
  .version(packageJson.version)
  .arguments('[project-directory]')
  .action(name => {
    projectName = name;
  })
  .option('--dry-run', 'dry run')
  .parse(process.argv);

console.log(projectName, program.opts());
/**
 * 检查当前node版本是否符合要求
 */
function checkCurrentNodeVersion() {
  if (!semver.satisfies(process.versions.node, packageJson.engines.node)) {
    console.error(
      `${packageJson.name} requires Node version ${packageJson.engines.node}, but current Node version is ${process.versions.node}`
    );
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  }
}
