let blockSize = 8; // Dimensione iniziale più piccola per contenere tutta la griglia
let cols, rows;
let totalSecondsInDay = 24 * 60 * 60; // 86400 secondi in un giorno
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
  // Spazio disponibile per la griglia (lasciando margini e spazio per l'orario)
  let availableWidth = width - 120; // Margini laterali
  let availableHeight = height - 350; // Più spazio per orario sopra e info sotto
  
  // Calcola la dimensione ottimale per contenere esattamente 86400 quadratini
  let optimalBlockSize = 1;
  let bestCols = 0, bestRows = 0;
  
  // Cerca la dimensione migliore che fa entrare tutti i 86400 quadratini
  for (let testSize = 15; testSize >= 4; testSize--) {
    let testCols = Math.floor(availableWidth / testSize);
    let testRows = Math.ceil(totalSecondsInDay / testCols);
    
    // Verifica se la griglia entra completamente nello spazio disponibile
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
  
  // Calcola le dimensioni effettive della griglia
  gridWidth = cols * blockSize;
  gridHeight = rows * blockSize;
  
  // Centra la griglia nella finestra
  gridStartX = (width - gridWidth) / 2;
  gridStartY = (height - gridHeight) / 2 + 60; // Offset maggiore per data e orario
}

function draw() {
  background(30);
  
  // Ottieni l'ora corrente
  let h = hour();
  let m = minute();
  let s = second();
  
  // Calcola i secondi trascorsi dall'inizio della giornata
  let secondsElapsed = h * 3600 + m * 60 + s;
  
  // Disegna il contorno della griglia completa
  drawGridBorder();
  
  // Disegna la griglia
  drawGrid(secondsElapsed);
  
  // Mostra l'orario digitale
  displayTime(h, m, s);
  
  // Mostra le informazioni che seguono il quadratino corrente
  displayMovingInfo(secondsElapsed);
  
  // Controlla se è mezzanotte per il reset (opzionale, avviene automaticamente)
  checkMidnightReset(h, m, s);
}

function drawGridBorder() {
  // Disegna il contorno della griglia completa
  stroke(120);
  strokeWeight(2);
  noFill();
  rect(gridStartX - 2, gridStartY - 2, gridWidth + 4, gridHeight + 4);
  
  // Aggiungi un'etichetta sotto la griglia
  fill(255); // Bianco senza contorno
  noStroke();
  textAlign(CENTER, TOP);
  textSize(22); // Testo più grande
  text("Griglia: " + cols + " x " + rows + " = " + totalSecondsInDay + " secondi (" + blockSize + "px)", 
       width/2, gridStartY + gridHeight + 40);
}

function drawGrid(secondsElapsed) {
  // Disegna tutti i quadratini della griglia per riempire completamente lo spazio
  for (let i = 0; i < cols * rows; i++) {
    let col, row;
    
    // Calcola posizione con movimento a serpentina
    row = Math.floor(i / cols);
    if (row % 2 === 0) {
      // Riga pari: da sinistra a destra
      col = i % cols;
    } else {
      // Riga dispari: da destra a sinistra
      col = cols - 1 - (i % cols);
    }
    
    let x = gridStartX + col * blockSize;
    let y = gridStartY + row * blockSize;
    
    // Colora il quadratino
    if (i < secondsElapsed) {
      fill(200); // Grigio chiaro per i secondi trascorsi
    } else if (i === secondsElapsed && i < totalSecondsInDay) {
      // Quadratino corrente lampeggiante (solo se siamo ancora dentro la giornata)
      fill(frameCount % 60 < 30 ? 200 : 100);
    } else if (i < totalSecondsInDay) {
      fill(60); // Grigio scuro per i secondi futuri della giornata
    } else {
      // Quadratini extra per riempire completamente la griglia
      fill(40); // Grigio molto scuro per i quadratini extra
    }
    
    stroke(40);
    strokeWeight(1);
    rect(x, y, blockSize, blockSize);
  }
}

function displayTime(h, m, s) {
  // Ottieni i nomi dei giorni della settimana in italiano
  let giorni = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
  let mesi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", 
              "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
  
  let oggi = new Date();
  let giornoSettimana = giorni[oggi.getDay()];
  let giorno = oggi.getDate();
  let mese = mesi[oggi.getMonth()];
  let anno = oggi.getFullYear();
  
  // Formatta la data completa
  let dataStr = giornoSettimana + ", " + giorno + " " + mese + " " + anno;
  
  // Formatta l'orario
  let timeStr = nf(h, 2) + ":" + nf(m, 2) + ":" + nf(s, 2);
  
  // Mostra la data sopra l'orario
  fill(200);
  textAlign(CENTER, BOTTOM);
  textSize(24); // Testo più grande
  textStyle(NORMAL);
  text(dataStr, width/2, gridStartY - 130);
  
  // Mostra l'orario sotto la data
  fill(255);
  textAlign(CENTER, BOTTOM);
  textSize(42); // Testo più grande
  textStyle(BOLD);
  text(timeStr, width/2, gridStartY - 80);
}

function displayMovingInfo(secondsElapsed) {
  // Calcola la posizione del quadratino corrente
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
  
  // Calcola la percentuale del giorno trascorso
  let percentage = (secondsElapsed / totalSecondsInDay * 100).toFixed(2);
  
  // Testo da mostrare vicino al quadratino corrente
  let infoText = secondsElapsed + " / " + totalSecondsInDay + " (" + percentage + "%)";
  
  textAlign(LEFT, CENTER);
  textSize(26); // Testo più grande
  textStyle(BOLD);
  
  // Calcola la posizione del testo considerando i bordi
  let textX = currentX + blockSize + 15;
  let textY = currentY + blockSize/2;
  
  // Misura la larghezza del testo
  let txtWidth = textWidth(infoText);
  
  // Controlla se il testo esce dal bordo destro
  if (textX + txtWidth > width - 20) {
    textX = currentX - txtWidth - 15;
    textAlign(RIGHT, CENTER);
  }
  
  // Controlla se il testo esce dal bordo sinistro  
  if (textX < 20) {
    textX = width/2;
    textY = currentY - 30;
    textAlign(CENTER, CENTER);
  }
  
  // Controlla se il testo esce dal bordo inferiore
  if (textY + 15 > height - 20) {
    textY = currentY - 30;
  }
  
  // Controlla se il testo esce dal bordo superiore della griglia
  if (textY < gridStartY + 15) {
    textY = currentY + blockSize + 25;
  }
  
  // Disegna il contorno bianco del testo
  stroke(255);
  strokeWeight(3);
  fill(139, 0, 0); // Rosso scuro
  text(infoText, textX, textY);
  
  // Disegna il testo principale rosso scuro senza contorno
  noStroke();
  fill(139, 0, 0); // Rosso scuro
  text(infoText, textX, textY);
}

function checkMidnightReset(h, m, s) {
  // A mezzanotte (00:00:00) la griglia si resetta automaticamente
  // Questo succede naturalmente perché secondsElapsed torna a 0
  if (h === 0 && m === 0 && s === 0) {
    // Opzionale: potresti aggiungere qui effetti speciali per il reset
    // Per ora il reset avviene automaticamente nel calcolo
  }
  
  // Mostra un messaggio quando il giorno è completato
  if (h === 23 && m === 59 && s >= 55) {
    fill(255, 100, 100);
    textAlign(CENTER, BOTTOM);
    textSize(24); // Testo più grande
    textStyle(BOLD);
    text("Giornata quasi completata!", width/2, height - 30);
  }
}