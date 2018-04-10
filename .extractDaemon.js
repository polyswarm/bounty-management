const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const deasync = require('deasync');
const rimrafSync = deasync(rimraf);

module.exports = (buildPath, electronVersion, platform, arch, callback) => {
  let tail;
  switch (platform) {
    case 'linux':
      breakoutLinux(buildPath);
      break;
    case 'win32':
      breakoutWindows(buildPath);
      break;
    case 'darwin':
    default:
      throw Error(`Application does not support platform ${platform}`);
  }
  callback();
}

breakoutWindows = (buildPath) => {
  const unzip = require('adm-zip');
  const filename = 'polyswarmd-electron-win.zip';
  const app = path.resolve(buildPath);
  const backend = path.resolve(app, 'backend');
  const polyswarmd = path.resolve(app,  'polyswarmd');

  const zip = new unzip(path.resolve(backend, filename))

  rimrafSync(polyswarmd);
  fs.mkdirSync(polyswarmd);
  const entries = zip.getEntries();
  entries.forEach((e) => {
    zip.extractEntryTo(e, polyswarmd, false, true);
  });
}

breakoutLinux = (buildPath) => {
  const tar = require('tar');
  const tarXSync = deasync(tar.x);

  const filename = 'polyswarmd-electron-x86_64-linux.tar.gz';
  const app = path.resolve(buildPath);
  const backend = path.resolve(app, 'backend');
  const polyswarmd = path.resolve(app,  'polyswarmd');

  rimrafSync(polyswarmd);
  fs.mkdirSync(polyswarmd);
  tarXSync({
    file: path.resolve(backend, filename),
    strip: 1,
    C: polyswarmd
  });

  const dest = path.resolve(polyswarmd, 'polyswarmd.cfg');
  const cfg = path.resolve(backend, 'polyswarmd.cfg');
  fs.copyFileSync(cfg, dest);
  if (buildPath.match(/[\\/]tmp/)) {
    rimrafSync(backend)
   }
}