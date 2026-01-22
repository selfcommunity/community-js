const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get the parameter from command line
const pipelineType = process.argv[2]; // 'prerelease' or 'release'

if (!pipelineType || !['prerelease', 'release'].includes(pipelineType)) {
  console.error(
    '❌ Usage: node scripts/check-next-version.js [prerelease|release]',
  );
  process.exit(1);
}

console.log(
  `🔍 Checking versions for pipeline: ${pipelineType.toUpperCase()}\n`,
);

try {
  // Check changed packages
  const changed = execSync('lerna changed --json', { encoding: 'utf8' });

  if (!changed.trim()) {
    console.log(
      '✅ No packages have changed. There will be no new publications.',
    );
    process.exit(0);
  }

  const packages = JSON.parse(changed);

  console.log('📦 Packages that will be updated:');
  packages.forEach((pkg) => {
    console.log(`   • ${pkg.name}@${pkg.version}`);
  });

  console.log('\n🎯 Simulating versions that will be created:');

  // Simulate the appropriate command based on pipeline type
  let versionCommand;

  if (pipelineType === 'prerelease') {
    // For prerelease: use conventional-prerelease
    versionCommand =
      'lerna version --conventional-commits --conventional-prerelease --no-push --no-git-tag-version --yes';
  } else {
    // For release: instead of graduate, use normal conventional-commits to get the next version
    // then we'll manually check which packages need to be graduated
    versionCommand =
      'lerna version --conventional-commits --no-push --no-git-tag-version --yes';
  }

  // Backup package.json files before simulation
  const backups = new Map();
  packages.forEach((pkg) => {
    const packageJsonPath = path.join(pkg.location, 'package.json');
    const originalContent = fs.readFileSync(packageJsonPath, 'utf8');
    backups.set(packageJsonPath, originalContent);
  });

  // Execute versioning command
  console.log(`\n🚀 Executing: ${versionCommand}\n`);
  execSync(versionCommand, { stdio: 'inherit' });

  // Show new versions
  console.log('\n📋 New versions that will be published:');
  packages.forEach((pkg) => {
    const packageJsonPath = path.join(pkg.location, 'package.json');
    const updatedPackageJson = JSON.parse(
      fs.readFileSync(packageJsonPath, 'utf8'),
    );

    let finalVersion = updatedPackageJson.version;

    // If this is a release pipeline and the version contains prerelease suffix,
    // show what the graduated version would be
    if (pipelineType === 'release' && finalVersion.includes('-alpha')) {
      // For release, we want to show the graduated version (without -alpha)
      const baseVersion = finalVersion.split('-')[0];
      finalVersion = baseVersion;
      console.log(
        `   ✨ ${updatedPackageJson.name}@${finalVersion} (graduated from ${updatedPackageJson.version})`,
      );
    } else {
      const versionType =
        pipelineType === 'prerelease' ? '(prerelease)' : '(release)';
      console.log(
        `   ✨ ${updatedPackageJson.name}@${finalVersion} ${versionType}`,
      );
    }
  });

  // Restore original package.json files
  console.log('\n🔄 Restoring original files...');
  backups.forEach((originalContent, filePath) => {
    fs.writeFileSync(filePath, originalContent);
  });

  // Also restore lerna.json if it was modified
  execSync('git checkout -- lerna.json', { stdio: 'ignore' });
  execSync('git checkout -- packages/*/package.json', { stdio: 'ignore' });

  console.log('✅ Simulation completed successfully!');

  if (pipelineType === 'prerelease') {
    console.log('\n💡 To publish prereleases, run:');
    console.log('   yarn prerelease');
  } else {
    console.log('\n💡 To publish releases, run:');
    console.log('   yarn release');
    console.log(
      '\n⚠️  Note: Release will graduate prerelease versions and create new versions based on conventional commits.',
    );
  }
} catch (error) {
  console.error('❌ Error during simulation:', error.message);

  // Restore files in case of error
  try {
    execSync('git checkout -- lerna.json packages/*/package.json', {
      stdio: 'ignore',
    });
    console.log('🔄 Files restored after error');
  } catch (restoreError) {
    console.error('⚠️  Error restoring files:', restoreError.message);
  }

  process.exit(1);
}
