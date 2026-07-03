import fetch from "node-fetch";

async function test() {
      const station = process.env.WUNDERGROUND_STATION_ID || 'ICHOEL1';
      const apiKey = process.env.WUNDERGROUND_API_KEY;
      
      console.log("API_KEY:", apiKey);
      
      if (!apiKey) {
         throw new Error("WUNDERGROUND_API_KEY is not configured");
      }
      
      const now = new Date();
      const dateStrToday = now.toISOString().slice(0,10).replace(/-/g, '');
      
      const yesterday = new Date(now.getTime() - 86400000);
      const dateStrYesterday = yesterday.toISOString().slice(0,10).replace(/-/g, '');
      
      const url1 = \`https://api.weather.com/v2/pws/history/hourly?stationId=\${station}&format=json&units=m&date=\${dateStrYesterday}&apiKey=\${apiKey}\`;
      const res1 = await fetch(url1);
      console.log(res1.status);
      const text1 = await res1.text();
      console.log(text1.substring(0, 100));
}
test();
