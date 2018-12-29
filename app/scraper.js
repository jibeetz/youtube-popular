const fs = require("fs");
const puppeteer = require('puppeteer');
const DataUrl = require('./constants').url;

(async () => {

	const browser = await puppeteer.launch({headless: false, devtools: true});
	const page = await browser.newPage();

	page.on("error", function(err) {
		theTempValue = err.toString();
		console.log("Page error: " + theTempValue);
	})

	page.on("pageerror", function(err) {
		theTempValue = err.toString();
		console.log("Page error: " + theTempValue);
	})

	// await page.exposeFunction('cleanResult', async result => {

	// 	return new Promise((resolve, reject) => {

	// 		if(result === 'L' || result === 'L-wo')
	// 			result = 0;

	// 		if(result === 'W' || result === 'W-wo')
	// 			result = 1;

	// 		if(result === 'T')
	// 			result = -1;

	// 		resolve(result);
	// 	});
	// });

	async function captureTeam(page, team) {

		await page.goto(DataUrl(team.code), {waitUntil: 'networkidle0'});

		await page.waitFor(3000);
	}

	await captureTeam(page, team);

	await browser.close();
})();