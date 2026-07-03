// api.ts: Migración del backend (server.ts) al cliente para Capacitor

export async function fetchWeatherClient() {
  try {
    const code = "d2533437581";
    const pageUrl = `https://app.weathercloud.net/${code}`;
    
    const pageResponse = await fetch(pageUrl);
    if (!pageResponse.ok) throw new Error("Failed to fetch station page");
    
    const html = await pageResponse.text();
    const tokenMatch = html.match(/WEATHERCLOUD_CSRF_TOKEN:"([^"]+)"/);
    const codeMatch = html.match(/code:"([^"]+)"/);
    
    if (!tokenMatch || !codeMatch) {
       throw new Error("Failed to parse token or code from page");
    }
    
    const token = tokenMatch[1];
    const numericCode = codeMatch[1];
    
    // Al usar CapacitorHttp, las cookies se manejan nativamente en la mayoría de los casos.
    // Capacitor se encarga de interceptar y saltar las restricciones de CORS.
    const statsUrl = `https://app.weathercloud.net/device/stats?code=${numericCode}&WEATHERCLOUD_CSRF_TOKEN=${token}`;
    
    const statsResponse = await fetch(statsUrl, {
       headers: {
          "X-Requested-With": "XMLHttpRequest"
       }
    });
    
    if (!statsResponse.ok) throw new Error("Failed to fetch weather stats");
    
    return await statsResponse.json();
  } catch (error) {
    console.error("Error fetching weather client:", error);
    throw error;
  }
}

export async function fetchForecastClient() {
  try {
    const aicRes = await fetch("https://www.aic.gob.ar/sitio/home?a=1022&z=1915406561");
    if (!aicRes.ok) throw new Error("Failed to fetch forecast from AIC");
    
    const html = await aicRes.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const tables = doc.querySelectorAll('table');
    const tbl = tables[1]; // The second table has extended forecast
    
    if (!tbl) throw new Error("No forecast table found");

    const headers: any[] = [];
    const trs = tbl.querySelectorAll('tr');
    
    if (trs.length > 0) {
       const ths = trs[0].querySelectorAll('th');
       ths.forEach((th, i) => {
           if (i > 0) {
               headers.push({ date: th.textContent?.trim() || "" });
           }
       });
    }

    const days: any[] = [];
    trs.forEach((tr, j) => {
       const tds = tr.querySelectorAll('td');
       if (tds.length === 0) return;
       
       const thText = tds[0].textContent?.trim() || "";
       tds.forEach((td, k) => {
           if (k === 0) return;
           const dayIdx = k - 1;
           days[dayIdx] = days[dayIdx] || {};
           
           const text = td.textContent?.replace(/\s+/g, ' ').trim() || "";
           if (thText === 'Estado') {
               const descText = text.replace(/([a-z])([A-Z])/g, '$1, $2');
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

       return {
          date: h.date, 
          maxTemp: d.maxTemp ?? 0,
          minTemp: d.minTemp ?? 0,
          weatherCode: code,
          desc: d.desc || ""
       };
    });

    return forecast;
  } catch (error) {
    console.error("Error fetching forecast client:", error);
    throw error;
  }
}

export async function fetchHistoryClient() {
    try {
      const station = import.meta.env.VITE_WUNDERGROUND_STATION_ID || 'ICHOEL1';
      const apiKey = import.meta.env.VITE_WUNDERGROUND_API_KEY || "6ab7bdb9be904e2cb7bdb9be905e2c4c";
      
      const now = new Date();
      const dateStrToday = now.toISOString().slice(0,10).replace(/-/g, '');
      
      const yesterday = new Date(now.getTime() - 86400000);
      const dateStrYesterday = yesterday.toISOString().slice(0,10).replace(/-/g, '');
      
      const url1 = `https://api.weather.com/v2/pws/history/hourly?stationId=${station}&format=json&units=m&date=${dateStrYesterday}&apiKey=${apiKey}`;
      const url2 = `https://api.weather.com/v2/pws/history/hourly?stationId=${station}&format=json&units=m&date=${dateStrToday}&apiKey=${apiKey}`;
      
      const [res1, res2] = await Promise.all([fetch(url1), fetch(url2)]);
      
      let obs: any[] = [];
      if (res1.status === 200) {
         const d1 = await res1.json();
         if (d1.observations) obs = obs.concat(d1.observations);
      }
      if (res2.status === 200) {
         const d2 = await res2.json();
         if (d2.observations) obs = obs.concat(d2.observations);
      }
      
      return obs;
    } catch (error) {
      console.error("Error fetching history client:", error);
      throw error;
    }
}
