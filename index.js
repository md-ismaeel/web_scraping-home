const axios = require('axios');
const cheerio = require("cheerio");
const fs = require("node:fs")
const xlsx = require('xlsx')

let pageUrl = 'https://www.quikr.com/jobs/quicker-job-in-hyderabad+hyderabad+zwqxj4157493934';

let headers = {
    "content-type": "text/html",
};

const getDataFromWebPage = async (url) => {

    try {
        const response = await axios.get(url, {
            headers,
        })

        let resData = response.data;
        fs.writeFileSync('webpage.txt', resData);

    } catch (error) {
        console.log("Error_ocurred", error);
        return null;
    }
}

// getDataFromWebPage(pageUrl)

const readDataFile = () => {
    let fileData = fs.readFileSync('webpage.txt', { encoding: 'utf-8' })
    // console.log(fileData);
    return fileData
}

const htmString = readDataFile();

if (htmString) {
    const $ = cheerio.load(htmString);
    const products = [];

    $('div.job-card').each((index, element) => {
        // console.log($(element).text());
        let JobTitle = $(element).find('.job-title').text()
        let jobType = $(element).find('.attributeVal').text()
        products.push({
            JobTitle,
            jobType
        })
    })

    console.log(products);

    const workBook = xlsx.utils.book_new()
    const workSheet = xlsx.utils.json_to_sheet(products)
    xlsx.utils.book_append_sheet(workBook, workSheet, "Sheet1");
    xlsx.writeFile(workBook, "products.xlsx");

} else {
    console.log('content is not available');
}