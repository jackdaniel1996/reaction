"use strict";

function initGame() {
	document.querySelector('.cube').classList.add('starting'); // add class for animation
	setTimeout(() => { startCountdown(() => {startGame()})}, 1200); // start the countdown then run the game
}

const delay = async (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms))
async function startCountdown(callback) {
	const countDownElem = document.getElementById('countDown');
	const tl = gsap.timeline({ default: { ease: "power2.out" } });
	for (let i = 3; i > 0; i -= 1) {
		tl.fromTo(countDownElem, { css: { scale: 1, opacity: 1 }, duration: 0, }, { css: { scale: 2, opacity: 0 }, duration: 1, });
		countDownElem.textContent = i
		await delay(1000)
	}
	tl.fromTo(countDownElem, { css: { scale: 1, opacity: 1 }, duration: 0, }, { css: { scale: 2, opacity: 0 }, duration: 1, });
	countDownElem.textContent = "Go!"
	setTimeout(() => { countDownElem.textContent = ""; callback() }, 1000)
}

function startGame() {
	const randomStart = (Math.floor(Math.random() * 10) + 1) * 1000; // returns number between 1 and 10
	const bg = document.querySelector('.top');
	const stop = document.getElementById('stopButton')
	let stopwatch = { elapsedTime: 0 }
	let gameIsRunning = false;
	let gameTimeout;

	function takeTime() {
		// Take reaction time
		gameIsRunning = true;
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
		}, 0);
		//Stop timer
		stop.addEventListener("click", endTimer);
		function endTimer(){
			clearInterval(stopwatch.intervalId);
			stop.removeEventListener("click", endTimer)
			endGame(stopwatch)
		}
	}	
	// change bg color and start taking time
	gameTimeout = setTimeout(() => {bg.style.backgroundColor = '#f75858'; takeTime(); }, randomStart);

	// when button is pressed to early:
	stop.addEventListener("click", function(){
		if(!gameIsRunning){
			clearTimeout(gameTimeout);
			endGame()
		}
	});
}

function createScoreboard() {
	const scoreboard = document.getElementById('scoreboard');
	const scoreRow = document.querySelector('.scoreboard-row');		
	let scoreObj = JSON.parse(window.localStorage.getItem("score"));

	//sort by time		
	let sortetScore = [];
	for (var sTime in scoreObj) {
		sortetScore.push([sTime, scoreObj[sTime]]);
	}

	sortetScore.sort(function(a, b) {
		return a[1]['time'] - b[1]['time'];
	});

	// Create scorboard entry
	scoreboard.innerHTML = '';
	let pos = 0;
	sortetScore.forEach(() => {
		let row = scoreRow.cloneNode(true);
		let appendRow = scoreboard.appendChild(row);
		appendRow;
		appendRow.querySelector('.text-center').innerHTML = sortetScore[pos][1]['player']
		appendRow.querySelector('.text-right').innerHTML = sortetScore[pos][1]['time'];
		pos++;
		appendRow.querySelector('.text-left').innerHTML = pos;
	});
	console.log(sortetScore)
	console.log(scoreObj)

}

function endGame(endTime) {
	const milliseconds = document.getElementById('elapsedMil');
	const seconds = document.getElementById('elapsedSec');
	const bg = document.querySelector('.top');
	const timer = document.getElementById('timerContainer');
	let name = document.getElementById('userName').value;
	let tooEarlyP = document.createElement("p")
	
	if(endTime === undefined){
		tooEarlyP.classList.add('too-early');
		tooEarlyP.innerHTML = "Zu Früh!";
		let tooEarly = document.getElementById('timerContainer').appendChild(tooEarlyP);
		tooEarly;
		document.querySelector('.timer').style.display = 'none';
	}

	if(name.length == 0 && endTime !== undefined) {
		endTime['name'] = 'Spieler 1';
	}

	const tl = gsap.timeline({ default: { ease: "power2.out" } });
	tl.add('start')
	.to(bg, {css: { backgroundColor: "white" }, duration: 1}, 'start')
	.to(timer, {css: { scale: 1.5, fontWeight: "bold" }, duration: 0.5}, 'start');
	
	console.log('stopwatch:', endTime)
	console.log('name:', name)

	function resetGame() {
		document.querySelector('.cube').classList.remove('starting');
		seconds.innerHTML = '0';
		milliseconds.innerHTML = '000';
		tooEarlyP.remove()
		document.querySelector('.timer').style.display = 'block';
		tl.to(timer, { scale: 1, fontWeight: "400" })
	}

	function saveScore() {
		let savedScore = JSON.parse(window.localStorage.getItem("score"));
		let scoreObj = {};

		if(savedScore != null) {
			scoreObj = savedScore;
		}
		
		let gamesCount = (Object.keys(scoreObj).length) + 1;
		let player = name;
		let time = Number(`${endTime.seconds}.${endTime.milliseconds}`);
		scoreObj['game' + gamesCount] = {};
		scoreObj['game' + gamesCount]['player'] = player;
		scoreObj['game' + gamesCount]['time'] = time;
		window.localStorage.setItem("score", JSON.stringify(scoreObj));
		createScoreboard(); 		
	}
	if(endTime !== undefined) {
		saveScore()
	}

	setTimeout(() =>{resetGame()}, 2000);
}

window.onload = function WindowLoad(event) {
	// Scoreboard
	createScoreboard()
    // animation
    const tl = gsap.timeline({default: {ease: "power2.out"}})	
    tl.to('#headline, .animationContainer', {
		x: '0vw', 
        duration: 0.5,
        stagger: 0.25
    });
}

//todo remove eventlistner