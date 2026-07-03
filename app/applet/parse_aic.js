const fs = require('fs');
const cheerio = require('cheerio');
const html = fs.readFileSync('aic.html', 'utf-8');
const $ = cheerio.load(html);

console.log($('title').text());

console.log("Looking for forecast specific items");
$('div').each((i, el) => {
    const text = $(el).text().replace(/\s+/g, ' ');
    if (text.includes('Máx') || text.includes('Mín') || text.includes('Max') || text.includes('Min')) {
        console.log($(el).attr('class'), $(el).html().substring(0, 50));
    }
});
