function initGame() {
	document.querySelector('.cube').classList.add('starting') // add class for animation
	setTimeout(() => { startCountdown(() => {startGame()})}, 1200) // start the countdown then run the game
}

const delay = async (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms))
async function startCountdown(callback) {
	const countDownElem = document.getElementById('countDown');
	const tl = gsap.timeline({ default: { ease: "power2.out" } });
	for (let i = 3; i > 0; i -= 1) {
		tl.to(countDownElem, { css: { scale: 1, opacity: 1 }, duration: 0, }).to(countDownElem, { css: { scale: 2, opacity: 0 }, duration: 1, });
		countDownElem.textContent = i
		await delay(1000)
	}
	tl.to(countDownElem, { css: { scale: 1, opacity: 1 }, duration: 0, }).to(countDownElem, { css: { scale: 2, opacity: 0 }, duration: 1, });
	countDownElem.textContent = "Go!"
	setTimeout(() => { countDownElem.textContent = ""; callback() }, 1000)
}


function startGame() {
	const randomStart = (Math.floor(Math.random() * 10) + 1) * 1000; // returns number between 1 and 10
	const bg = document.querySelector('.top');
	const stop = document.getElementById('stopButton')
	let stopwatch = { elapsedTime: 0 }

	function takeTime() {
		// Take reaction time
		stopwatch.startTime = Date.now();
		stopwatch.intervalId = setInterval(() => {
			//calculate elapsed time
			const elapsedTime = Date.now() - stopwatch.startTime + stopwatch.elapsedTime
			const milliseconds = document.getElementById('elapsedMil');
			const seconds = document.getElementById('elapsedSec');
			//calculate different time measurements based on elapsed time
			stopwatch.milliseconds = parseInt((elapsedTime%1000))
			stopwatch.seconds = parseInt((elapsedTime/1000)%60)
			stopwatch.minutes = parseInt((elapsedTime/(1000*60))%60)
			//display timer
			milliseconds.innerHTML = stopwatch.milliseconds;
			seconds.innerHTML = stopwatch.seconds;
			//TODO: wenn eine Minute erreicht ist: Timer stoppen. Anzeige: Zu langsam
		}, 0);
		stop.addEventListener("click", function() {
			clearInterval(stopwatch.intervalId);
			console.log('stopwatch:',stopwatch)
			endGame(stopwatch)
		});
	}	
	// change bg color and start taking time
	setTimeout(() => {bg.style.backgroundColor = '#f75858'; takeTime(); }, randomStart);
}

function endGame(endTime) {

}