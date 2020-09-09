/**
 * 显示帮助
 */

const help = require('u-help')
const pkg = require('../package.json')

function main () {
  help.show('xtqiniu v' + pkg.version, {
    '命令': {
      upload: '上传文件到七牛，支持上传文件夹'
    }
  })
}

module.exports = {
  run: main
}
