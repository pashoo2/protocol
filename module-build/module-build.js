const fs = require('fs');
const path = require('path');
const tsConfig = require('../tsconfig-build.json');
const outDirName = tsConfig.compilerOptions.outDir || tsConfig.compilerOptions.declarationDir;

if (!outDirName) {
  throw new Error('Failed to define output directory name');
}

const buildPath = path.resolve(__dirname, `../${outDirName}`);
const packageJsonTargetPath = path.resolve(buildPath, '../package.json');
const packageJsonOriginPath = path.resolve(__dirname, '../package.json');
const packageJsonModulePath = path.resolve(__dirname, './package.module.json');

fs.stat(buildPath, (err, stat) => {
  if (err) {
    throw err;
  }
  if (!stat.isDirectory()) {
    throw new Error('The build directory was not found');
  }
  fs.accessSync(buildPath, fs.constants.W_OK);
  fs.stat(packageJsonOriginPath, (err, stat) => {
    if (err) {
      throw err;
    }
    if (stat.isDirectory()) {
      throw new Error('The original package.json was not found');
    }
    fs.accessSync(packageJsonOriginPath, fs.constants.R_OK);
    fs.readFile(packageJsonOriginPath, (err, jsonData) => {
      if (err) {
        throw err;
      }

      const packageJsonOriginParsed = JSON.parse(jsonData.toString());

      fs.stat(packageJsonModulePath, (err, stat) => {
        if (err) {
          throw err;
        }
        if (stat.isDirectory()) {
          throw new Error('The module package.json was not found');
        }
        fs.accessSync(packageJsonModulePath, fs.constants.R_OK);
        fs.readFile(packageJsonModulePath, (err, jsonData) => {
          if (err) {
            throw err;
          }

          const packageJsonModuleParsed = JSON.parse(jsonData.toString());
          const defaultsDeep = require('lodash.defaultsdeep');
          const resultedPackageJson = defaultsDeep(
            {
              version: packageJsonOriginParsed.version,
              description: packageJsonOriginParsed.description,
              dependencies: packageJsonOriginParsed.dependencies,
            },
            packageJsonModuleParsed
          );
          fs.writeFileSync(packageJsonTargetPath, JSON.stringify(resultedPackageJson, null, 2), {
            mode: 0o666,
          });
        });
      });
    });
  });
});
