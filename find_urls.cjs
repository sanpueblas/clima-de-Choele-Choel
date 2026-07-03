const code = "d2533437581";
const urls = [
  `https://app.weathercloud.net/device/values?code=${code}`,
  `https://app.weathercloud.net/device/values/${code}`,
  `https://app.weathercloud.net/device/stats?code=${code}`,
  `https://app.weathercloud.net/device/stats/${code}`
];

async function run() {
  for (const url of urls) {
    try {
      const r = await fetch(url, { headers: { "X-Requested-With": "XMLHttpRequest" }});
      const t = await r.text();
      console.log(`URL: ${url}`);
      console.log(`Status: ${r.status}`);
      console.log(`Data: ${t.substring(0, 500)}`);
    } catch(e) {
      console.log(`URL: ${url} error: ${e.message}`);
    }
  }
}
run();
