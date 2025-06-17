let lightningFlash = false;
let lightningTimer = 0;
let lightningDuration = 20; // durata del lampo in frame
let nextLightning = 0;
let thunderSounds = [];
let thunderDelay = 0;
let playThunder = false;

function preload() {
	for (let i = 1; i <= 5; i++) {
	  thunderSounds.push(loadSound(`audio/fulmine_${i}.mp3`));
	}
  }

function setup() {
	createCanvas(windowWidth, windowHeight);
	scheduleNextLightning();

	for (let sound of thunderSounds) {
		sound.setVolume(0.3)
	}
}
// funzione per ridimensionare dimensione canvas in base 
// a evento di cambiamento dimensione della finestra

function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
}

function scheduleNextLightning() {
	nextLightning = frameCount + random(180, 600);
  }

function playRandomThunder() {
	let randomSound = random(thunderSounds);
	if (randomSound.isLoaded()) {
	  randomSound.play();
	}
  }

  function draw() {
	
	if (frameCount >= nextLightning && !lightningFlash) {
	  lightningFlash = true;
	  lightningTimer = 0;
	  
	  
	  thunderDelay = frameCount + random(120, 360); 
	  playThunder = true;
	}
	
	
	if (playThunder && frameCount >= thunderDelay) {
		playRandomThunder();
		playThunder = false;
	  }
	
	
	if (lightningFlash) {
	  lightningTimer++;
	  if (lightningTimer >= lightningDuration) {
		lightningFlash = false;
		scheduleNextLightning(); 
	  }
	}
	
	
	if (lightningFlash) {
	  background(255); 
	} else {
	  background(0); 
	}

 
	for (let i=0; i<100; i++) {
		let gl = random(10, 150)
		let gx = random(0, width)
		let gy = random(-gl, height)
		// Se si mette solo uno dei valori allora 0 è implicito
		// 50 compreso e 150 non compreso (si ferma ad un valore prima)
		// valore della lunghezza parte da lato superiore del canva (come gy)
	
	strokeWeight(random(1, 3))

	if (lightningFlash) {
		stroke(0, random(100, 200)); 
	  } else {
		stroke(255, random(100, 255));
	  }

	line(gx, gy, gx, gy + gl)
}

}
