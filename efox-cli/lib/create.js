const chalk = require('chalk')
const validateAppName = require('validate-npm-package-name') // 检查名字是否合法
const fs = require('fs-extra')  // fs-extra是fs的一个扩展
const inquirer = require('inquirer') // 命令行交互行工具
const path = require('path')
const Creator = require('./Creator')


async function create(appName, options) {
  const cwd = typeof process.cwd === 'function' ? process.cwd() :  process.cwd // 当前工作路径
  let name = appName || 'efox'
  name = options.dest ? 'efox' : name  // 如果dest有值，则直接使用efox
  const targetDir = path.resolve(cwd, name)  // 目标路径

  // 验证项目名称合法性
  const result = validateAppName(name)
  if (!result.validForNewPackages) {
    console.error(chalk.red(`非法的项目名: ${name}`))
    result.errors && result.errors.forEach(err => console.error(chalk.red.dim(`Error: ${err}`)))
    result.warnings && result.warnings.forEach(warn => console.warn(chalk.yellow.dim(`Warnings: ${warn}`)))
    exit('命名非法')
    process.exit(1)
  }

  // 存在同名目录
  if (fs.existsSync(targetDir)) {
    // 强制生成则直接删除原有目录
    if (options.force) {
      await fs.remove(targetDir)
    } else {
      const { action } = await inquirer.prompt([
        {
          name: 'action',
          type: 'list',
          message: `使用的项目名 ${chalk.cyan(targetDir)} 已存在。 选择以下操作:`,
          choices: [
            {
              name: '覆写',
              value: 'overwrite'
            }, 
            // {
            //   name: '合并',
            //   value: 'merge'
            // },
            {
              name: '取消',
              value: false
            }
          ]
        }
      ])
      if (!action) {
        return
      } else if (action === 'overwrite') {
        console.log(`\n${chalk.green('删除')} ${chalk.cyan(targetDir)}\n`)
        await fs.remove(targetDir)
      }
    }
  }

  const creator = new Creator(name, targetDir, path.resolve(cwd))
  await creator.create(options)
  // console.log(appName, options, name, targetDir, result, path.resolve(cwd))
}

module.exports = (...args) => {
  return create(...args).catch(err => {
    exit(err)
  })
}

function exit(err) {
  console.log(`${chalk.red('运行错误！❌ 终止运行！')}`)
  console.log(`${chalk.white(err)}`)
}