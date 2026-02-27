import sslChecker from 'ssl-checker';
console.log('sslChecker:', sslChecker);
try {
    const result = await sslChecker('google.com');
    console.log('Result:', result);
} catch (e) {
    console.log('Error:', e.message);
}
