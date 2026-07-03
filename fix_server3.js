import fs from 'fs';

let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  'const [res1, res2] = await Promise.all([fetch(url1), fetch(url2)]);',
  'const [res1, res2] = await Promise.all([fetch(url1), fetch(url2)]); console.log(url1, res1.status); console.log(url2, res2.status);'
);

fs.writeFileSync('server.ts', code);
console.log("Fixed logs!");
