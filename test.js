import fetch from "node-fetch";

async function test() {
      const station = process.env.WUNDERGROUND_STATION_ID || 'ICHOEL1';
      const apiKey = process.env.WUNDERGROUND_API_KEY || '6ab7bdb9be904e2cb7bdb9be905e2c4c';
      
      const now = new Date();
      const dateStrToday = now.toISOString().slice(0,10).replace(/-/g, '');
      
      const yesterday = new Date(now.getTime() - 86400000);
      const dateStrYesterday = yesterday.toISOString().slice(0,10).replace(/-/g, '');
      
      const url1 = \`https://api.weather.com/v2/pws/history/hourly?stationId=\${station}&format=json&units=m&date=\${dateStrYesterday}&apiKey=\${apiKey}\`;
      const url2 = \`https://api.weather.com/v2/pws/history/hourly?stationId=\${station}&format=json&units=m&date=\${dateStrToday}&apiKey=\${apiKey}\`;
      
      console.log(url1);
      
      const res1 = await fetch(url1);
      const text1 = await res1.text();
      console.log("res1", res1.status, text1.substring(0, 50));
}
test();
