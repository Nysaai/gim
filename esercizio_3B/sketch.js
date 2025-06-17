let blockSize = 8; 
let cols, rows;
let totalSecondsInDay = 24 * 60 * 60; 
let gridWidth, gridHeight;
let gridStartX, gridStartY;

function setup() {
  createCanvas(windowWidth, windowHeight);
  calculateFixedGrid();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  calculateFixedGrid();
}

function calculateFixedGrid() {
  
  let availableWidth = width - 120; 
  let availableHeight = height - 350; 
  
  
  let optimalBlockSize = 1;
  let bestCols = 0, bestRows = 0;
  
  
  for (let testSize = 15; testSize >= 4; testSize--) {
    let testCols = Math.floor(availableWidth / testSize);
    let testRows = Math.ceil(totalSecondsInDay / testCols);
    
    
    if (testCols * testSize <= availableWidth && testRows * testSize <= availableHeight) {
      optimalBlockSize = testSize;
      bestCols = testCols;
      bestRows = testRows;
      break;
    }
  }
  
  blockSize = optimalBlockSize;
  cols = bestCols;
  rows = bestRows;
  
  
  gridWidth = cols * blockSize;
  gridHeight = rows * blockSize;
  
  
  gridStartX = (width - gridWidth) / 2;
  gridStartY = (height - gridHeight) / 2 + 60; 
}

function draw() {
  background(30);
  
  
  let h = hour();
  let m = minute();
  let s = second();
  
  
  let secondsElapsed = h * 3600 + m * 60 + s;
  
  
  drawGridBorder();
  
  
  drawGrid(secondsElapsed);
  
  
  displayTime(h, m, s);
  
  
  displayMovingInfo(secondsElapsed);
  
  
  checkMidnightReset(h, m, s);
}

function drawGridBorder() {
  
  stroke(120);
  strokeWeight(2);
  noFill();
  rect(gridStartX - 2, gridStartY - 2, gridWidth + 4, gridHeight + 4);
  
  
  fill(255); 
  noStroke();
  textAlign(CENTER, TOP);
  textSize(22); 
  text("Griglia: " + cols + " x " + rows + " = " + totalSecondsInDay + " secondi (" + blockSize + "px)", 
       width/2, gridStartY + gridHeight + 40);
}

function drawGrid(secondsElapsed) {
  
  for (let i = 0; i < cols * rows; i++) {
    let col, row;
    
    
    row = Math.floor(i / cols);
    if (row % 2 === 0) {
      
      col = i % cols;
    } else {
      
      col = cols - 1 - (i % cols);
    }
    
    let x = gridStartX + col * blockSize;
    let y = gridStartY + row * blockSize;
    
    
    if (i < secondsElapsed) {
      fill(200); 
    } else if (i === secondsElapsed && i < totalSecondsInDay) {
      
      fill(frameCount % 60 < 30 ? 200 : 100);
    } else if (i < totalSecondsInDay) {
      fill(60); 
    } else {
      
      fill(40); 
    }
    
    stroke(40);
    strokeWeight(1);
    rect(x, y, blockSize, blockSize);
  }
}

function displayTime(h, m, s) {
  
  let giorni = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
  let mesi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", 
              "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
  
  let oggi = new Date();
  let giornoSettimana = giorni[oggi.getDay()];
  let giorno = oggi.getDate();
  let mese = mesi[oggi.getMonth()];
  let anno = oggi.getFullYear();
  
  
  let dataStr = giornoSettimana + ", " + giorno + " " + mese + " " + anno;
  
  
  let timeStr = nf(h, 2) + ":" + nf(m, 2) + ":" + nf(s, 2);
  
  
  fill(200);
  textAlign(CENTER, BOTTOM);
  textSize(24); 
  textStyle(NORMAL);
  text(dataStr, width/2, gridStartY - 130);
  
  
  fill(255);
  textAlign(CENTER, BOTTOM);
  textSize(42); 
  textStyle(BOLD);
  text(timeStr, width/2, gridStartY - 80);
}

function displayMovingInfo(secondsElapsed) {
  
  let currentIndex = Math.min(secondsElapsed, totalSecondsInDay - 1);
  let currentRow = Math.floor(currentIndex / cols);
  let currentCol;
  
  if (currentRow % 2 === 0) {
    currentCol = currentIndex % cols;
  } else {
    currentCol = cols - 1 - (currentIndex % cols);
  }
  
  let currentX = gridStartX + currentCol * blockSize;
  let currentY = gridStartY + currentRow * blockSize;
  
  
  let percentage = (secondsElapsed / totalSecondsInDay * 100).toFixed(2);
  
  
  let infoText = secondsElapsed + " / " + totalSecondsInDay + " (" + percentage + "%)";
  
  textAlign(LEFT, CENTER);
  textSize(26); 
  textStyle(BOLD);
  
  
  let textX = currentX + blockSize + 15;
  let textY = currentY + blockSize/2;
  
  
  let txtWidth = textWidth(infoText);
  
  
  if (textX + txtWidth > width - 20) {
    textX = currentX - txtWidth - 15;
    textAlign(RIGHT, CENTER);
  }
  
  
  if (textX < 20) {
    textX = width/2;
    textY = currentY - 30;
    textAlign(CENTER, CENTER);
  }
  
  
  if (textY + 15 > height - 20) {
    textY = currentY - 30;
  }
  
  
  if (textY < gridStartY + 15) {
    textY = currentY + blockSize + 25;
  }
  
  
  stroke(255);
  strokeWeight(3);
  fill(139, 0, 0); 
  text(infoText, textX, textY);
  
  
  noStroke();
  fill(139, 0, 0); 
  text(infoText, textX, textY);
}

function checkMidnightReset(h, m, s) {
 
  if (h === 0 && m === 0 && s === 0) {
   
  }
  
  
  if (h === 23 && m === 59 && s >= 55) {
    fill(255, 100, 100);
    textAlign(CENTER, BOTTOM);
    textSize(24); 
    textStyle(BOLD);
    text("Giornata quasi completata!", width/2, height - 30);
  }
}