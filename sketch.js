
function preload(){
  sound = loadSound('clairdelune.mp3');
}
const maxiterations = 50;
const colorsRed = [];
const colorsGreen = [];
const colorsBlue = [];
let angle = 0;
let xplace = 0;
let flag = true;
function setup() {
  pixelDensity(1);
  
  let cnv = createCanvas(1280, 720);
  colorMode(HSB, 1);
  cnv.mouseClicked(togglePlay);
  fft = new p5.FFT();
  sound.amp(1.0);
  for (let n = 0; n < maxiterations; n++) {
  // Gosh, we could make fancy colors here if we wanted
  let hu = sqrt(n / maxiterations);
  let col = color(hu, 1);
  //colorsRed[n] = red(col);
  //colorsGreen[n] = green(col);
  colorsBlue[n] = blue(col);
  }
  frameRate(30);
}

function draw() {
  background(255);
  
  let spectrum = fft.analyze();
  let sum = 0;
  for(let i = 0; i < spectrum.length; i++){
      sum += spectrum[i];
  }
  let average = sum / spectrum.length;
  
  let ca = map(xplace, 0, width, -1, 1);
  if(flag == true){
    xplace += 1.0;
  }
  else{
    xplace -= 1.0;
  }
  if(xplace >= width && flag == true){
    flag = false;
  }
  else if(xplace <= 0 && flag == false){
    flag = true;
  }
  //-0.70176;
  let cb = map(average*50, 0, height, -1, 1); //-0.3842 + angle;
  if(average == 0){
    ca = 0.0;
    cb = 0.0;
  }
  let w = 5;
  let h = (w * height) / width;

  // Start at negative half the width and height
  let xmin = -w / 2;
  let ymin = -h / 2;


  loadPixels();
  
  // x goes from xmin to xmax
  let xmax = xmin + w;
  // y goes from ymin to ymax
  let ymax = ymin + h;

  // Calculate amount we increment x,y for each pixel
  let dx = (xmax - xmin) / width;
  let dy = (ymax - ymin) / height;

  // Start y
  let y = ymin;
  for (let j = 0; j < height; j++) {
    // Start x
    let x = xmin;
    for (let i = 0; i < width; i++) {
      let a = x;
      let b = y;
      let n = 0;
      while (n < maxiterations) {
        let aa = a * a;
        let bb = b * b;
        if (aa + bb > 4.0) {
          break; // Bail
        }
        let twoab = 2.0 * a * b;
        a = aa - bb + ca;
        b = twoab + cb;
        n++;
      }

      let pix = (i + j * width) * 4;
      if (n == maxiterations) {
        pixels[pix + 0] = 1;
        pixels[pix + 1] = 1;
        pixels[pix + 2] = 1;
      } else {
        // Otherwise, use the colors that we made in setup()
        pixels[pix + 0] = colorsRed[n];
        pixels[pix + 1] = colorsGreen[n];
        pixels[pix + 2] = colorsBlue[n];
      }
      x += dx;
    }
    y += dy;
  }
  updatePixels();
}

function togglePlay() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}