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
    const jobDetailsData = [];

    $(".jsListItems").find(".job-card").each((index, elem) => {
        const jobTitle = $(elem).find(".job-title").text();
        const jobDetailsDiv = $(elem).find(".salaryNjobtype ").children()
        const salary = $(jobDetailsDiv[0]).find(".perposelSalary ").text();
        const jobType = $(jobDetailsDiv[1]).find(".attributeVal").text();
        const companyName = $(jobDetailsDiv[2]).find(".attributeVal").text();
        const experienceDivChildren = $(jobDetailsDiv[3]).find(".lineH ").children();
        const experience = experienceDivChildren.length > 0 && $(experienceDivChildren[1]).text();
        const jobPostedOn = $(elem).find(".jsPostedOn").text();

        if (jobTitle.length > 0) {
            const jobDetails = {
                "Job Title": jobTitle,
                "Salary": salary,
                "Job Type": jobType,
                "Company": companyName,
                "Experience": experience,
                "Job Posted On": jobPostedOn
            }
            jobDetailsData.push(jobDetails);
        }
    });
    console.log(jobDetailsData);

    const workBook = xlsx.utils.book_new()
    const workSheet = xlsx.utils.json_to_sheet(jobDetailsData)
    xlsx.utils.book_append_sheet(workBook, workSheet, "Sheet1");
    xlsx.writeFile(workBook,"jobDataSheet.xlsx")
}