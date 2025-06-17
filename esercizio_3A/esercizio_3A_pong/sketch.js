let posX, velX, posY, velY
let trail = []
let color1, color2
let colorPairs = [
  [[255, 255, 100], [255, 100, 100]], // Da giallo a rosso
  [[100, 255, 100], [100, 100, 255]], // Da verde a blu
  [[255, 100, 255], [100, 255, 255]], // Da magenta a ciano
  [[255, 150, 100], [150, 100, 255]], // Da arancione a viola
  [[255, 100, 150], [100, 255, 150]], // Da rosa a verde chiaro
  [[150, 255, 255], [255, 255, 150]]  // Da azzurro a giallo chiaro
]
let currentColorPair = 0
let ballSize = 20
let possibleSizes = [15, 25, 35, 45, 55]
let baseSpeed = 6 



function setup() {
	createCanvas(500, 400)

	posX = 200
  	posY = 200
  
	updateSpeed()


	color1 = colorPairs[currentColorPair][0]
  	color2 = colorPairs[currentColorPair][1]

	background(40)
}

function draw() {

	// VARIANTE DI SCRITTURA
	// if(posX >= width) {
	// 	velX = -velX
	// } else if (posX < 0) {
	// 	velX = -velX
	// }

	posX = posX + velX
	posY = posY + velY

	if(posX >= width - ballSize/2 || posX < ballSize/2) {
		velX = -velX
		changeSizeAndColors()
	  }

	  if(posY >= height - ballSize/2 || posY < ballSize/2) {
		velY = -velY
		changeSizeAndColors()
	  }

	
	  let t = map(posX, ballSize/2, width - ballSize/2, 0, 1)
  if(velX < 0) t = 1 - t // Inverti se va verso sinistra
  
  let currentR = lerp(color1[0], color2[0], t)
  let currentG = lerp(color1[1], color2[1], t)
  let currentB = lerp(color1[2], color2[2], t)
	
  trail.push({
    x: posX, 
    y: posY, 
    r: currentR, 
    g: currentG, 
    b: currentB,
    size: ballSize
  })
  

  for(let i = 0; i < trail.length; i++) {
    noStroke()
    fill(trail[i].r, trail[i].g, trail[i].b)
    ellipse(trail[i].x, trail[i].y, trail[i].size)
  }

	//pallina
	noStroke()
	fill(currentR, currentG, currentB)
	ellipse(posX, posY, ballSize)

}


function changeSizeAndColors() {
	
	ballSize = random(possibleSizes)
	

	if(posX <= ballSize/2) {
	  posX = ballSize/2 + 1
	} else if(posX >= width - ballSize/2) {
	  posX = width - ballSize/2 - 1
	}
	
	if(posY <= ballSize/2) {
	  posY = ballSize/2 + 1
	} else if(posY >= height - ballSize/2) {
	  posY = height - ballSize/2 - 1
	}
	
	// Cambia colori
	currentColorPair = (currentColorPair + 1) % colorPairs.length
	color1 = colorPairs[currentColorPair][0]
	color2 = colorPairs[currentColorPair][1]
	
	updateSpeed()
  }

  function updateSpeed() {
	// Più grande è la pallina, più lenta va
	let speedFactor = map(ballSize, 15, 55, 1.5, 0.3)
	
	// Mantieni la direzione ma cambia la velocità
	let dirX = velX >= 0 ? 1 : -1
	let dirY = velY >= 0 ? 1 : -1
	
	velX = baseSpeed * speedFactor * dirX
	velY = baseSpeed * speedFactor * dirY
  }
	  
	  // Funzione per pulire il canvas (opzionale)
	  function keyPressed() {
		if(key === ' ') {
		  trail = []
		  background(40)
		}
	  }