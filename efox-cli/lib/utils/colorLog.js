const colors = require('colors')

colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'red',
  info: 'green',
  data: 'blue',
  help: 'cyan',
  warn: 'yellow',
  debug: 'magenta',
  error: 'red'

})

const log = console.log

class Logger {
  log (msg) {
    msg = formateMsg(msg)
    return log('\n' + msg)
  }
  warn (msg) {
    return log('\n' + colors.warn(msg))
  }
  help (msg) {
    msg = formateMsg(msg)
    return log('\n' + colors.help(msg))
  }
  error (msg) {
    return log('\n' + colors.error(msg))
  }
  info (msg) {
    return log('\n' + colors.info(msg))
  }
}

/*
 *TODO:用正则改写提取字符串
*/
function formateMsg (str) {
  return str.split('*').map((item, index) => {
    if (index % 2) {
      return colors.warn(item)
    }
    return item
  }).join('').split('^').map((item, index) => {
    if (index % 2) {
      return colors.info(item)
    }
    return item
  }).join('')
}

const logger = new Logger()

module.exports = logger