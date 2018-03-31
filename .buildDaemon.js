const extract = require('./.extractDaemon.js');
const rimraf = require('rimraf');
const path = require('path');
const deasync = require('deasync');

const rimrafSync = deasync(rimraf);
rimrafSync(path.resolve(process.cwd(), 'polyswarmd'));
extract(process.cwd(), 0, 'linux', '', () => {});