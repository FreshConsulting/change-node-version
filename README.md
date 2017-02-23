# Change Node Version
This script detects the current node version and changes to one that satisfies the setting in package.json. If no value is present in package.json it defaults to 0.12.18.

# Installation

`npm install --save-dev change-node-version`

or

`yarn add -D change-node-version`

# Before Use

## Have N installed

`curl -L https://git.io/n-install | bash`

or

`npm install -g n`

or

`yarn global add n`

## Document Your Node Version 
Make sure you have a valid package.json setting for the prject's required node version.
```json
{
  ...

  "engines": {
    "node": "4.5.0 - 6.5.0"
  }
}
```
Theoretically, the version notation should be any notation that node-semver can parse.
[https://github.com/npm/node-semver](https://github.com/npm/node-semver)

However, it is better to stick to simpler expressions, if you can.

# Example Usage

## Gulp
```javascript
'use strict';

 // Dependencies
var gulp = require('gulp');

// change node script
try {
  require('change-node-version');
} catch(e) {
  console.log('Error changing Node version: ', e);
  // If the script fails you can stop by using:
  // process.exit(1)
  // If you want to let the script continue just swallow the exception and continue on
}

gulp.task('build', function(cb) {
  console.log('gulp build fired');
  // ...
});

// ...
```

## NPM Hook (preinstall, prebuild, etc)
In npm hooks, we want to utilize the `continue` argument when calling the script. See the end of the lines.
This lets the npm hook run the next command (since the version is changed between commands) instead of stopping the process and starting over.

```json
{
  "scripts": {
    "preinstall": "change-node-version continue || echo 'Hook failed'",
    "prebuild": "change-node-version continue || echo 'Hook failed'",
    "pretest": "change-node-version continue || echo 'Hook failed'",
    // ...
  }
}
```
Notice the `|| echo 'Hook failed'` section at the end. This allows the scripts to continue on as usual. If you would like the process to stop, you can omit that section from the hook lines.

## CLI
```
node node_modules/change-node-version/index.js
```

