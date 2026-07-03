const fs = require('fs');
const html = fs.readFileSync('wc.html', 'utf8');
const tokenMatch = html.match(/WEATHERCLOUD_CSRF_TOKEN:"([^"]+)"/);
const token = tokenMatch ? tokenMatch[1] : null;
const codeMatch = html.match(/code:"([^"]+)"/);
const code = codeMatch ? codeMatch[1] : null;
console.log({token, code});
