import geoip from 'geoip-lite';
const ip = "8.8.8.8";
const geo = geoip.lookup(ip);
console.log('Geo:', geo);
