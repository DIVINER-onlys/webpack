const git = require('git-promise') // 运行git命令

async function downloadRepo(repoPath, localPath, appName, branch) {
  const _branch = branch ? `-b ${branch} --` : '--'
  const _repoPath = `clone ${_branch} ${repoPath} ${localPath}`
  // console.log('\ngit:', _repoPath)
  return git(_repoPath)
}

module.exports = downloadRepo