const extract = require('./.extractDaemon.js');
const path = require('path');

extract(process.cwd(), 0, process.platform, '', () => {});