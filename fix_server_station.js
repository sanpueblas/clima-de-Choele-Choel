import fs from 'fs';

let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  "const station = process.env.WUNDERGROUND_STATION_ID || 'ICHOEL1';",
  "let station = process.env.WUNDERGROUND_STATION_ID || 'ICHOEL1'; if (station.length > 20) station = 'ICHOEL1';"
);

fs.writeFileSync('server.ts', code);
console.log("Fixed station!");
