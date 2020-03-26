#!/usr/bin/env node
// 解决了不同的用户node路径不同的问题，可以让系统动态的去查找node来执行你的脚本文件
// https://github.com/jingzhiMo/jingzhiMo.github.io/issues/15
console.log('谢邀，人在家，刚下飞机')

const semver = require('semver') // 语义化版本控制模块
const chalk = require('chalk') // 支持修改控制台中字符串的样式 字体样式、字体颜色、背景颜色
const program = require('commander') // 命令行工具
const ora = require('ora') // 实现node.js命令行环境的loading效果，和显示各种状态的图标等
const package = require('../package.json')
// const enhanceErrorMessages = require('../lib/utils/enhanceErrorMessages') // enhance common error messages

// 检查node版本
function checkNodeVersion(wanted, id) {
  if(!semver.satisfies(process.version, wanted)) {
    console.log(chalk.red.bold.bgBlack(
      `You are using Node ${process.version}, but this version of ${id} requires Node ${wanted}.\nPlease upgrade your Node version.`
    ))
    process.exit(1)
  }
}

// commander passes the Command object itself as options,
// extract only actual options into a fresh object.
function cleanArgs(cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''))
    // if an option is not present and Command has a method with the same name
    // it should not be copied
    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}

// 小驼峰转换
function camelize(str) {
  return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

checkNodeVersion(package.engines.node, 'efox')

program
  .version(package.version, '-v, --version')
  .usage('<command> [options]')

program
  .command('create [app-name]')
  .alias('c')
  .description('基于efox-cli创建一个项目')
  .option('-p, --project <project>', '选择项目组')
  .option('-m, --module <module>', '选择项目组内的目标目录')
  // .option('-d, --dest', '直接在当前目录生成项目')
  // .option('-g, --gitClone <repository>', '使用远程git项目作为模板')
  .option('-f, --force', '覆写同名文件夹生成项目')
  .action((name, cmd) => {
    const options = cleanArgs(cmd)
    if (process.argv.includes('-g') || process.argv.includes('--git')) {
      options.forceGit = true
    }
    require('../lib/create')(name, options)
  })


program
  .command('info')
  .description('查看当前运行环境')
  .action((cmd) => {
    console.log(chalk.green.bold('\nEnvironment Info:'))
    const spinner = ora('Start loading system configuration...').start()
    // eninfo 获取系统的信息，设备信息，浏览器，node版本等
    require('envinfo').run(
      {
        System: ['OS', 'CPU'],
        Binaries: ['Node', 'Yarn', 'npm'],
        Browsers: ['Chrome', 'Edge', 'Firefox', 'Safari'],
        npmPackages: '/**/{*efox*,@efox/*,*vue*,@vue/*/}',
        npmGlobalPackages: ['@efox/efoxcli']
      },
      {
        showNotFound: true,
        duplicates: true,
        fullTree: true
      }
    ).then(res => {
      console.log(chalk.green(res))
      spinner.succeed('Loading system configuration is complete')
    })
  })


// output help information on unknown commands
program
  .arguments('[command]')
  .action((cmd) => {
    if (!process.argv.slice(2).length) {
      program.outputHelp()
      return
    }
    program.outputHelp()
    console.log(chalk.red(`\n未知命令：${chalk.yellow(cmd)}, 帮助请输入: ${chalk.green('efox-cli --help')}\n`))
  })


// add some useful info on help
program.on('--help', () => {
  console.log(`  使用 ${chalk.cyan.green.bold(`efox-cli <command> --help`)} 命令来查询对应的使用方式`)
})


program.commands.forEach(c => c.on('--help', () => console.log()))

program
  .parse(process.argv)

// console.log('测试', program.args, process.argv)

