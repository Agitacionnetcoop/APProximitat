var shell = require('shelljs');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

shell.exec('eval $(ssh-agent -s)')

shell.exec('ssh-add ./keys/cooapp-sync')

shell.exec('GIT_SSH_COMMAND="ssh -i ./keys/cooapp-sync" git pull')

// we copy the .env file to the dist for the coapp-api
shell.exec('npm install')

shell.exec('(pm2 delete cooapp-api || true) && pm2 start "npm start" --name cooapp-api')

// we finish the process
shell.echo('✅ Done')