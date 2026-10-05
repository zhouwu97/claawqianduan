const { spawnSync } = require('node:child_process')
const result = spawnSync(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['run', 'test:e2e'], { stdio: 'inherit', shell: process.platform === 'win32' })
process.exit(result.status ?? 1)
