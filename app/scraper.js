const fs = require("fs");
const puppeteer = require('puppeteer');

module.exports = {

	scrap: function(channelUrl) {
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

			async function captureTeam(page) {

				await page.goto(channelUrl + '/videos?flow=grid&view=0&sort=p', {waitUntil: 'networkidle0'});

				let videosList = await page.evaluate(async () => {

					let videos = await document.querySelectorAll('ytd-grid-video-renderer');

					let data = [];

					for (const video of videos) {
						let videoTitle = await video.querySelector('#video-title').innerText;
						let videoUrl = await video.querySelector('#video-title').href;
						let  videoObj = {}
						videoObj.url = videoUrl
						videoObj.title = videoTitle
						data.push(videoObj)
					}

					return data;

				})

				for (let [i, videoItem] of videosList.entries()) {
					if(i > 3)
						break;

					await page.goto(videoItem.url, {waitUntil: 'networkidle0'});

					let infose = await page.evaluate(async () => {

						let infos = {}
						infos.views = await document.querySelector('.view-count').innerText;
						infos.date = await document.querySelector('.date').innerText;
						infos.likes = await document.querySelector('#top-level-buttons ytd-toggle-button-renderer:nth-child(1) yt-formatted-string').getAttribute('aria-label');
						infos.dislikes = await document.querySelector('#top-level-buttons ytd-toggle-button-renderer:nth-child(2) yt-formatted-string').getAttribute('aria-label');
						infos.likeBar = await document.querySelector('#like-bar').getAttribute('style');

						return infos
					})

					Object.assign(videosList[i], infose);
				}

				videosList = videosList.map( (video) => {

					if(typeof video.views !== 'undefined'){
						video.views = video.views.replace(' views', '').replace(/,/g, '');
						video.views = parseInt(video.views)
					}

					if(typeof video.likes !== 'undefined'){
						video.likes = video.likes.replace(' likes', '').replace(/,/g, '');
						video.likes = parseFloat(video.likes)
					}

					if(typeof video.dislikes !== 'undefined'){
						video.dislikes = video.dislikes.replace(' dislikes', '').replace(/,/g, '');
						video.dislikes = parseFloat(video.dislikes)
					}

					if(typeof video.date !== 'undefined'){
						video.date = video.date.replace('Streamed live on ', '').replace('Published on ', '')
					}

					if(typeof video.likeBar !== 'undefined'){
						video.likeBar = video.likeBar.replace('width: ', '').replace(/%;/g, '');
						video.likeBar = parseFloat(video.likeBar)
					}

					return video
				})

				console.log('videosList', videosList);

				// fs.writeFile(__dirname + '/data/' + teamConstructed.meta.id + '.json', JSON.stringify(teamConstructed), function (err) {
				// 	if (err) return console.log(err);
				// 	console.log('Appended!');
				// });

				await page.waitFor(6000);
			}

			await captureTeam(page);

			await browser.close();
		})();
	}

}