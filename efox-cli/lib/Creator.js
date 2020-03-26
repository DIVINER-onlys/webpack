const ora = require('ora') // 实现node.js命令行环境的loading效果，和显示各种状态的图标等
const inquirer = require('inquirer')
const shell = require('shelljs')
const EventEmitter = require('events')
const fs = require('fs')
const path = require('path')
const downloadRepo = require('./utils/downloadRepo')
const logger = require('./utils/colorLog')

module.exports = class Creator extends EventEmitter {
  constructor(name, context, cwd) {
    super()
    this.name = name
    this.context = context
    this.cwd = cwd
  }

  async create(cliOptions = {}, preset = null) {
    // console.log('开始', cliOptions, this.context, this.name, this.cwd)
    const spinner = ora('加载efox-cli-config配置文件').start()
    const params = await this.getConfig(this.context, this.name).then(
      async log => {
        const res = fs.readFileSync(`${this.context}/config.json`, 'utf8')
        spinner.succeed('efox-cli-config配置文件加载完成')
        const config = JSON.parse(res)
        let selectData = {}
        if(cliOptions.project) {
          if (!config.modules[cliOptions.project]) {
            logger.info(`你所选项目组 ^^${cliOptions.project}^^ 不存在任何模板，请重新选择`)
            selectData = await this.selectProject(config, true)
          }
          // else {
          //   selectData.project = cliOptions.project
          //   const { module } = await this.selectModule(config, cliOptions.project, cliOptions.module)
          //   selectData.module = module
          // }
        } else {
          selectData = await this.selectProject(config)
        }

        return {
          project: selectData.project,
          module: selectData.module,
          localPath: this.context,
          projectName: this.name
        }
      }
    )

    const { project, module, localPath, projectName } = params

    shell.rm('-rf', path.join(localPath))
    spinner.start('开始加载模板文件')
    await this.getBaseProject(localPath, project, module)
    const git = require('simple-git')(localPath)
    git.pull('origin', 'master', (err, result) => {
      if (!err) {
        shell.rm('-rf', path.join(localPath, '.git'))
        spinner.succeed('加载模板文件完成')
      }
    })
  
    // console.log('\n参数', params)
  }

  async getBaseProject(localPath, project, module) {
    const httpPath = `https://github.com/DIVINER-onlys/${project}.git`
    return downloadRepo(httpPath, localPath, project, '')
  }

  async getConfig(localPath, projectName) {
    // Efox/cli 脚手架模板库地址
    const httpPath = `https://github.com/DIVINER-onlys/efox-cli-config.git`
    return downloadRepo(httpPath, localPath, projectName, '')
  }

  async selectProject(moduleConfig, isAgain) {
    const res = await inquirer.prompt([
      {
        name: 'project',
        type: 'list',
        message: `${isAgain !== undefined ? '重新':''}选择模板所在的项目组:`,
        choices: [...moduleConfig.projects]
      }
    ]).then(async answers => {
      const { project } = answers
      // if (!moduleConfig.modules[project]) {
      //   logger.info(`你所选项目组 ^^${project}^^ 不存在任何模板，请重新选择`)
      //   return this.selectProject(moduleConfig, true)
      // }
      // const { module } = await this.selectModule(moduleConfig, project)
      return { project }
    })
    return res
  }

  async selectModule(moduleConfig, project, setModule) {
    if (setModule) {
      let tmp = false
      moduleConfig.modules[project].forEach((item) => {
        if(item.name === setModule) {
          setModule = item.value
          tmp = true
        }
      })
      if(tmp) {
        return {
          module: setModule
        }
      } else {
        logger.warn(`\n所选 ${project} 项目组中不存在 ${setModule} 模块，重新选择模板\n`)
        return this.selectModule(moduleConfig, project)
      }
    }
    const res = await inquirer.prompt([
      {
        name: 'module',
        type: 'list',
        message: '选择需要的模板:',
        choices: [...moduleConfig.modules[project]]
      }
    ])
    return res
  }
}