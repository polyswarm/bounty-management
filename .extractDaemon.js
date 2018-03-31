module.exports = (buildPath, electronVersion, platform, arch, callback) => {
    const fs = require('fs');
    const tar = require('tar');
    const path = require('path');
    const rimraf = require('rimraf');
    const deasync = require('deasync');

    const tarXSync = deasync(tar.x);

    let tail;
    switch (platform) {
      case 'linux':
        tail = '-x86_64-linux.tar.gz'
        break;
      case 'win32':
      case 'darwin':
      default:
        throw Error(`Application does not support platform ${platform}`);
    }

    const filename = 'polyswarmd-electron-x86_64-linux.tar.gz';
    const app = path.resolve(buildPath);
    const backend = path.resolve(app, 'backend');
    const polyswarmd = path.resolve(app,  'polyswarmd');
    fs.mkdirSync(polyswarmd);
    tarXSync({
      file: path.resolve(backend, filename),
      strip: 1,
      C: polyswarmd
    })

    const dest = path.resolve(polyswarmd, 'polyswarmd.cfg');
    const cfg = path.resolve(backend, 'polyswarmd.cfg');
    fs.copyFileSync(cfg, dest);
    if (buildPath.match(/[\\/]tmp/)) {
      rimraf(backend, () => {
        callback();
      });
    }
}