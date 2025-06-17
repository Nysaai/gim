let fiocchi;

//variabile = 4
//variabile = {}
//variabile = [] è come tabella (variabile composta)

function setup() {
	createCanvas(windowWidth, windowHeight);

	fiocchi = [];

	const f = "✺";

	for(let i = 0; i < 333; i++) {
		let baseWhite = random(200, 255); 
		let yellowTint = random(15, 45);  
		let grayVariation = random(-60, -10); 
		

		fiocchi[i] = {
			px: random(0, width),
			py: random(-100, height),
			dim: random (10, 40),
			vel: random(0.5, 1.5),
			chr: f[Math.floor(random(f.length))],
			colore: color(
				constrain(baseWhite + grayVariation + yellowTint * 0.3, 180, 255), 
				constrain(baseWhite + grayVariation + yellowTint * 0.5, 180, 255),  
				constrain(baseWhite + grayVariation, 170, 255),                    
				random(180, 255) 
			  ),
			  
			  blur: random(1.5, 4.5),
			  shadowOffset: random(2, 5)
			}
		  }
		}
// Il : nel setup viene inserito solo in fase di
// creazione dell'oggetto
	


function draw() {

	background(10, 10, 40)
	
	for(let i = 0; i < fiocchi.length; i++) {
		fiocchi[i].px = fiocchi[i].px + random(-1.5, 1.5);
		fiocchi[i].py = fiocchi[i].py + fiocchi[i].vel;
	
	
	if(fiocchi[i].py > height + 100) {
		fiocchi[i].py = -100;
		fiocchi[i].px = random(0, width);
	}
	textAlign(CENTER, CENTER);
    textSize(fiocchi[i].dim);
    
    // Ombra sfocata (più scura e traslucida)
    fill(red(fiocchi[i].colore) * 0.3, green(fiocchi[i].colore) * 0.3, blue(fiocchi[i].colore) * 0.3, 80);
    for(let j = 0; j < 5; j++) {
      let offsetX = random(-fiocchi[i].blur, fiocchi[i].blur);
      let offsetY = random(-fiocchi[i].blur, fiocchi[i].blur);
      text(fiocchi[i].chr, fiocchi[i].px + offsetX, fiocchi[i].py + offsetY + fiocchi[i].shadowOffset);
    }
    
    // Fiocco principale con leggera sfocatura
    fill(fiocchi[i].colore);
    for(let j = 0; j < 4; j++) {
      let offsetX = random(-fiocchi[i].blur * 0.5, fiocchi[i].blur * 0.5);
      let offsetY = random(-fiocchi[i].blur * 0.5, fiocchi[i].blur * 0.5);
      text(fiocchi[i].chr, fiocchi[i].px + offsetX, fiocchi[i].py + offsetY);
    }
    
    // Fiocco centrale (più nitido)
    fill(red(fiocchi[i].colore), green(fiocchi[i].colore), blue(fiocchi[i].colore), 255);
    text(fiocchi[i].chr, fiocchi[i].px, fiocchi[i].py);
  }
}

	function windowResized() {
	resizeCanvas(windowWidth, windowHeight)
	
}


/*

* ✺ ✱ ✳ ✲ ✽ ❋ ☸ ⧆ ⊛ ⁕ ⁎ ﹡ ∗


*/