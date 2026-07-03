import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Add the API route to fetch data from Weathercloud
  app.get("/api/weather", async (req, res) => {
    try {
      const code = "d2533437581";
      const pageUrl = `https://app.weathercloud.net/${code}`;
      
      const pageResponse = await fetch(pageUrl);
      if (!pageResponse.ok) {
        throw new Error("Failed to fetch station page");
      }
      
      const cookies = pageResponse.headers.get("set-cookie") || "";
      const html = await pageResponse.text();
      const tokenMatch = html.match(/WEATHERCLOUD_CSRF_TOKEN:"([^"]+)"/);
      const codeMatch = html.match(/code:"([^"]+)"/);
      
      if (!tokenMatch || !codeMatch) {
         throw new Error("Failed to parse token or code from page");
      }
      
      const token = tokenMatch[1];
      const numericCode = codeMatch[1];
      
      const statsUrl = `https://app.weathercloud.net/device/stats?code=${numericCode}&WEATHERCLOUD_CSRF_TOKEN=${token}`;
      
      const statsResponse = await fetch(statsUrl, {
         headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Cookie": cookies
         }
      });
      
      if (!statsResponse.ok) {
         throw new Error("Failed to fetch weather stats");
      }
      
      const data = await statsResponse.json();
      res.json(data);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  
  app.get("/api/history", async (req, res) => {
    try {
      let station = process.env.WUNDERGROUND_STATION_ID || 'ICHOEL1'; if (station.length > 20) station = 'ICHOEL1';
      const apiKey = process.env.WUNDERGROUND_API_KEY || "6ab7bdb9be904e2cb7bdb9be905e2c4c";
      
      if (!apiKey) {
         throw new Error("WUNDERGROUND_API_KEY is not configured");
      }
      
      const now = new Date();
      const dateStrToday = now.toISOString().slice(0,10).replace(/-/g, '');
      
      const yesterday = new Date(now.getTime() - 86400000);
      const dateStrYesterday = yesterday.toISOString().slice(0,10).replace(/-/g, '');
      
      const url1 = `https://api.weather.com/v2/pws/history/hourly?stationId=${station}&format=json&units=m&date=${dateStrYesterday}&apiKey=${apiKey}`;
      const url2 = `https://api.weather.com/v2/pws/history/hourly?stationId=${station}&format=json&units=m&date=${dateStrToday}&apiKey=${apiKey}`;
      
      const [res1, res2] = await Promise.all([fetch(url1), fetch(url2)]); console.log(url1, res1.status); console.log(url2, res2.status);
      
      let obs = [];
      if (res1.status === 200) {
         const d1 = await res1.json();
         if (d1.observations) obs = obs.concat(d1.observations);
      }
      if (res2.status === 200) {
         const d2 = await res2.json();
         if (d2.observations) obs = obs.concat(d2.observations);
      }
      
      res.json(obs);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/forecast", async (req, res) => {
    try {
      const aicRes = await fetch("https://www.aic.gob.ar/sitio/home?a=1022&z=1915406561");
      if (!aicRes.ok) {
        throw new Error("Failed to fetch forecast from AIC");
      }
      const html = await aicRes.text();
      const cheerio = await import("cheerio");
      const $ = cheerio.load(html);

      const tbl = $('table').eq(1); // The second table has extended forecast
      const headers: any[] = [];
      tbl.find('tr').eq(0).find('th').each((i, th) => {
          if (i > 0) {
              headers.push({ date: $(th).text().trim() });
          }
      });

      const days: any[] = [];
      tbl.find('tr').each((j, tr) => {
         const tds = $(tr).find('td');
         if (tds.length === 0) return;
         
         const thText = $(tr).find('td').eq(0).text().trim();
         tds.each((k, td) => {
             if (k === 0) return;
             const dayIdx = k - 1;
             days[dayIdx] = days[dayIdx] || {};
             
             const text = $(td).text().replace(/\s+/g, ' ').trim();
             if (thText === 'Estado') {
                 const descText = text.replace(/([a-z])([A-Z])/g, '\$1, \$2');
                 days[dayIdx].desc = descText.split(', ')[0] || text;
             }
             if (thText === 'Temperatura') {
                 const temps = text.match(/(-?\d+)\s*ºC/g);
                 if (temps && temps.length >= 2) {
                     days[dayIdx].maxTemp = parseInt(temps[0]);
                     days[dayIdx].minTemp = parseInt(temps[1]);
                 } else if (temps && temps.length === 1) {
                     days[dayIdx].maxTemp = parseInt(temps[0]);
                     days[dayIdx].minTemp = parseInt(temps[0]); 
                 }
             }
         });
      });

      const forecast = headers.map((h, i) => {
         const d = days[i] || {};
         const desc = (d.desc || "").toLowerCase();
         let code = 3; // default partly cloudy
         if (desc.includes('lluvia') || desc.includes('llovizna') || desc.includes('inestable')) code = 61;
         else if (desc.includes('nieve') || desc.includes('nevad')) code = 71;
         else if (desc.includes('tormenta')) code = 95;
         else if (desc.includes('despejado')) code = 0;
         else if (desc.includes('nublado')) code = 3;

         // We will map 'date' format from 'viernes 26' into something we can display directly
         return {
            date: h.date, 
            maxTemp: d.maxTemp ?? 0,
            minTemp: d.minTemp ?? 0,
            weatherCode: code,
            desc: d.desc || ""
         };
      });

      res.json(forecast);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
