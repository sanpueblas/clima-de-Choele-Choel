import fs from 'fs';

let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  'const apiKey = process.env.WUNDERGROUND_API_KEY;',
  'const apiKey = process.env.WUNDERGROUND_API_KEY || "6ab7bdb9be904e2cb7bdb9be905e2c4c";'
);

fs.writeFileSync('server.ts', code);
console.log("Fixed apiKey fallback!");
