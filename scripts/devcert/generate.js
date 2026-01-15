const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

/**
 * Create certs files and start storybook in https using mkcert
 * mkcert is more reliable for local development and trusted by Chrome
 */

// Define paths
const certsDir = path.join(__dirname, '../../certs/');
const keyPath = path.join(certsDir, 'tls.key');
const certPath = path.join(certsDir, 'tls.cert');

// Create certs directory if it doesn't exist
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true });
}

// Check if mkcert is installed
try {
  execSync('mkcert -version', { stdio: 'pipe' });
} catch (error) {
  console.error('\x1b[31m%s\x1b[0m', 'Error: mkcert is not installed!');
  console.error('\x1b[33m%s\x1b[0m', 'Please install it first:');
  console.error('\x1b[33m%s\x1b[0m', '- macOS: brew install mkcert');
  console.error(
    '\x1b[33m%s\x1b[0m',
    '- Linux: apt install mkcert or equivalent for your distribution',
  );
  console.error(
    '\x1b[33m%s\x1b[0m',
    '- Windows: choco install mkcert or download from https://github.com/FiloSottile/mkcert/releases',
  );
  console.error(
    '\x1b[31m%s\x1b[0m',
    'Storybook will not start. Please install mkcert first.',
  );
  process.exit(1); // Exit with error code to prevent Storybook from starting
}

// Generate certificates for localhost only if they don't exist
if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  try {
    // Install local CA if not already installed
    execSync('mkcert -install', { stdio: 'inherit' });

    // Generate certificate for localhost
    execSync(
      `mkcert -key-file ${keyPath} -cert-file ${certPath} localhost 127.0.0.1 ::1`,
      {
        stdio: 'inherit',
      },
    );

    console.log('Successfully generated SSL certificates for localhost');
  } catch (error) {
    console.error('Error generating certificates:', error.message);
    process.exit(1);
  }
} else {
  console.log(
    'SSL certificates for localhost already exist, skipping generation',
  );
}
