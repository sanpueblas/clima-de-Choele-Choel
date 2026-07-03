import fs from 'fs';
import * as cheerio from 'cheerio';
const html = fs.readFileSync('aic.html', 'utf-8');
const $ = cheerio.load(html);

console.log($('title').text());

console.log("Looking for forecast specific items");
let count = 0;
$('div').each((i, el) => {
    const text = $(el).text().replace(/\s+/g, ' ');
    if (text.includes('Máx') || text.includes('Mín') || text.includes('Max') || text.includes('Min')) {
        // console.log($(el).attr('class'), $(el).html().substring(0, 50));
        count++;
    }
});
console.log("Divs with min/max:", count);

// Let's print the actual structure around a forecast table
const container = $('#divMeteograma');
console.log('Meteograma HTML:', container.html()?.substring(0, 200));

// Maybe look at all tables
$('table').each((i, el) => {
    console.log('Table class:', $(el).attr('class'));
    console.log($(el).text().substring(0, 200).replace(/\s+/g, ' '));
});
