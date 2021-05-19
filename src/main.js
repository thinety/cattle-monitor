const path = require('path');
const setup = require('./app');

setup(path.join(process.env.PORTABLE_EXECUTABLE_DIR, 'data.json'));
