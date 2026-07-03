import fs from 'fs';

let serverCode = fs.readFileSync('server.ts', 'utf8');

const historyEndpoint = `
  app.get("/api/history", async (req, res) => {
    try {
      const station = process.env.WUNDERGROUND_STATION_ID || 'ICHOEL1';
      const apiKey = process.env.WUNDERGROUND_API_KEY;
      
      if (!apiKey) {
         throw new Error("WUNDERGROUND_API_KEY is not configured");
      }
      
      const now = new Date();
      const dateStrToday = now.toISOString().slice(0,10).replace(/-/g, '');
      
      const yesterday = new Date(now.getTime() - 86400000);
      const dateStrYesterday = yesterday.toISOString().slice(0,10).replace(/-/g, '');
      
      const url1 = \`https://api.weather.com/v2/pws/history/hourly?stationId=\${station}&format=json&units=m&date=\${dateStrYesterday}&apiKey=\${apiKey}\`;
      const url2 = \`https://api.weather.com/v2/pws/history/hourly?stationId=\${station}&format=json&units=m&date=\${dateStrToday}&apiKey=\${apiKey}\`;
      
      const [res1, res2] = await Promise.all([fetch(url1), fetch(url2)]);
      
      let obs = [];
      if (res1.ok) {
         const d1 = await res1.json();
         if (d1.observations) obs = obs.concat(d1.observations);
      }
      if (res2.ok) {
         const d2 = await res2.json();
         if (d2.observations) obs = obs.concat(d2.observations);
      }
      
      res.json(obs);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });
`;

if (!serverCode.includes('/api/history')) {
  serverCode = serverCode.replace('app.get("/api/forecast"', historyEndpoint + '\n  app.get("/api/forecast"');
  fs.writeFileSync('server.ts', serverCode);
  console.log("History endpoint added!");
} else {
  console.log("Already has history endpoint.");
}
