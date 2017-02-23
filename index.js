#!/bin/node
'use strict';

try {
  // dependencies
  // semver must be in the devDependencies of the project in the package.json file
  var semver = require(process.cwd() + '/node_modules/semver/semver');
  var exec = require('child_process').exec;
  var execSync = require('child_process').execSync;

  // we use n to get the list of possible node versions.
  // it uses wget or curl behind the scenes to fetch the list
  var nodeVersions = execSync('n ls').toString().match(/\d+\.\d+\.\d+/g);

  var packageJson = require(process.cwd() + '/package.json');

  // default required version for package.json files without one set
  var requiredVersion = '0.12.18';
  if(packageJson.engines && packageJson.engines.node) {
    requiredVersion = packageJson.engines.node;
  }

  if(semver.satisfies(process.version, requiredVersion)) {
    // We just let things keep going
  } else {
    console.log('Changing Node version...');
    var cleanVersion = semver.minSatisfying(nodeVersions, semver.validRange(requiredVersion));
    execSync('n ' + cleanVersion);

    // If continue is passed we don't rerun the command to support npm script hooks
    if(process.argv[2] !== 'continue') {
      console.log('Restarting command... (command output is delayed)');
      var command = process.argv.join(' ');
      process.stdout.write(execSync(command).toString());
      process.exit();
    }
  }
} catch(e) {
  // Throwing here causes an exit code of 1 or lets it bubble up to the try/catch surrounding the require in a gulpfile
  throw e;
}
