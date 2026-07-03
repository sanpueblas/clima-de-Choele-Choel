import fs from 'fs';

let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  'if (res1.ok) {',
  'if (res1.status === 200) {'
).replace(
  'if (res2.ok) {',
  'if (res2.status === 200) {'
);

fs.writeFileSync('server.ts', code);
console.log("Fixed!");
