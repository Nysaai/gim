function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL)

// WEBGL permette di trasformare lo spazio in 3D
}

// funzione per ridimensionare dimensione canvas in base 
// a evento di cambiamento dimensione della finestra
function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
}


function draw() { 
	background(0)

	rotateX(-mouseY * 0.01)
	rotateY(-mouseX * 0.01)

//box(50, 50, 50)


let dimensione = 1000
 
	for (let i=0; i<1000; i++) {
		let gl = random(10, 150)
		let gx = random(-dimensione, dimensione)
		let gy = random(-dimensione, dimensione - gl)
		let gz = random(-dimensione, dimensione)
		// Se si mette solo uno dei valori allora 0 è implicito
		// 50 compreso e 150 non compreso (si ferma ad un valore prima)
		// valore della lunghezza parte da lato superiore del canva (come gy)
	
	strokeWeight(random(1, 2))
	stroke(255, random(100, 255))
	line(gx, gy, gz,    gx, gy + gl, gz)
}




}
