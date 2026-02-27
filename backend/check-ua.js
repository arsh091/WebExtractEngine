import * as ua from 'ua-parser-js';
console.log('Keys:', Object.keys(ua));
if (ua.default) console.log('Default is available');
if (ua.UAParser) console.log('UAParser is available');
