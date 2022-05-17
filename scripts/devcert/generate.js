const fs = require('fs');
const devcert = require('devcert');
const { execSync } = require('child_process');

/**
 * Create certs files and start storybook in https
 */
if (!fs.existsSync(`${__dirname}/../../certs/`)) {
  fs.mkdirSync(`${__dirname}/../../certs/`, (err) => {
    if (err) {
      throw err;
    }
  });
}
devcert
  .certificateFor(['localhost'])
  .then(({ key, cert }) => {
    fs.writeFileSync(`${__dirname}/../../certs/tls.key`, key);
    fs.writeFileSync(`${__dirname}/../../certs/tls.cert`, cert);
  })
  .catch((e) => {
    throw e;
  });
