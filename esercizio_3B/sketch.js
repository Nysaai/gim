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
  // Spazio riservato per testi e margini
  let topSpace = 120;  // Spazio per data e ora
  let bottomSpace = 100;  // Spazio per info griglia e messaggi
  let sideMargin = 40;  // Margini laterali
  
  let availableWidth = width - (sideMargin * 2);
  let availableHeight = height - topSpace - bottomSpace;
  
  let optimalBlockSize = 4;
  let bestCols = 0, bestRows = 0;
  
  // Trova la dimensione ottimale dei blocchi che permette di vedere tutta la griglia
  for (let testSize = 12; testSize >= 4; testSize--) {
    let testCols = Math.floor(availableWidth / testSize);
    let testRows = Math.ceil(totalSecondsInDay / testCols);
    
    if (testCols * testSize <= availableWidth && testRows * testSize <= availableHeight) {
      optimalBlockSize = testSize;
      bestCols = testCols;
      bestRows = testRows;
      break;
    }
  }
  
  // Se non trovato con dimensioni normali, forza adattamento
  if (bestCols === 0 || bestRows === 0) {
    // Calcola le dimensioni massime possibili per far stare tutto
    let maxCols = Math.floor(availableWidth / 4);  // Minimo 4px per blocco
    let requiredRows = Math.ceil(totalSecondsInDay / maxCols);
    let maxBlockHeight = Math.floor(availableHeight / requiredRows);
    
    optimalBlockSize = Math.max(2, Math.min(4, maxBlockHeight));
    bestCols = Math.floor(availableWidth / optimalBlockSize);
    bestRows = Math.ceil(totalSecondsInDay / bestCols);
  }
  
  blockSize = optimalBlockSize;
  cols = bestCols;
  rows = bestRows;
  
  gridWidth = cols * blockSize;
  gridHeight = rows * blockSize;
  
  gridStartX = (width - gridWidth) / 2;
  gridStartY = topSpace;
  
  // Debug: mostra i valori calcolati
  console.log(`Griglia: ${cols}x${rows}, Blocco: ${blockSize}px, Dimensioni: ${gridWidth}x${gridHeight}`);
  console.log(`Spazio disponibile: ${availableWidth}x${availableHeight}, Finestra: ${width}x${height}`);
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
  // Bordo della griglia più visibile
  stroke(180);
  strokeWeight(3);
  noFill();
  rect(gridStartX - 3, gridStartY - 3, gridWidth + 6, gridHeight + 6);
  
  // Informazioni sulla griglia
  fill(255); 
  noStroke();
  textAlign(CENTER, TOP);
  textSize(18); 
  text("Griglia: " + cols + " x " + rows + " = " + totalSecondsInDay + " secondi (" + blockSize + "px)", 
       width/2, gridStartY + gridHeight + 20);
}

function drawGrid(secondsElapsed) {
  // Disegna ogni blocco della griglia
  for (let i = 0; i < cols * rows && i < totalSecondsInDay; i++) {
    let col, row;
    
    row = Math.floor(i / cols);
    if (row % 2 === 0) {
      col = i % cols;
    } else {
      col = cols - 1 - (i % cols);
    }
    
    let x = gridStartX + col * blockSize;
    let y = gridStartY + row * blockSize;
    
    // Colora il blocco con colori più contrastanti
    if (i < secondsElapsed) {
      fill(220, 220, 220); // Secondi passati - grigio chiaro
    } else if (i === secondsElapsed) {
      // Secondo corrente (lampeggiante rosso/arancione)
      fill(frameCount % 40 < 20 ? 255 : 255, frameCount % 40 < 20 ? 100 : 200, 100);
    } else {
      fill(80, 80, 80); // Secondi futuri - grigio scuro
    }
    
    stroke(30);
    strokeWeight(blockSize > 2 ? 1 : 0); // Nascondi bordi per blocchi molto piccoli
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
  text(dataStr, width/2, gridStartY - 50);
  
  fill(255);
  textAlign(CENTER, BOTTOM);
  textSize(42); 
  textStyle(BOLD);
  text(timeStr, width/2, gridStartY - 10);
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
    // Reset logic se necessario
  }
  
  if (h === 23 && m === 59 && s >= 55) {
    fill(255, 100, 100);
    textAlign(CENTER, BOTTOM);
    textSize(24); 
    textStyle(BOLD);
    text("Giornata quasi completata!", width/2, height - 30);
  }
}