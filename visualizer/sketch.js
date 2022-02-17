var song
var fft
var img
var mascot
var particles = []

// load songs and background image assets
function preload() {
  soundFormats('mp3', 'ogg')
  song = loadSound('assets/kaleidescope')
  img = loadImage('assets/bg.jpg')
  mascot = loadImage('assets/main.png')
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES)
  rectMode(CENTER)
  imageMode(CENTER)
  fft = new p5.FFT(0.3)
  img.filter(BLUR, 5)

  noLoop()
}

function draw() {
  background(0)
  translate(width / 2, height / 2)

  // Analyze the song energey
  fft.analyze()
  amp = fft.getEnergy(20, 200)

  // Add vibrating effect on certain music value
  push()
  if (amp > 200) {
    rotate(random(-0.3, 0.3))
  }
  // Setup image size
  image(img, 0, 0, width + 100, height + 100)
  pop()

  var alpha = map(amp, 0, 255, 180, 150)
  fill(0, alpha)
  noStroke()
  rect(0, 0, width, height)

  stroke(255)
  strokeWeight(1)
  smooth()
  noFill()

  push()
  if (amp > 200) {
    rotate(random(-0.5, 0.5))
  }
  image(mascot, 0, 0)
  pop()

  var wave = fft.waveform()

  // For loop for 2 half circle
  for (var t = -1; t <= 1; t += 2) {

    // Create circle
    beginShape()
    for (var i = 0; i <= 180; i += 0.5) {
      var index = floor(map(i, 0, width, 0, wave.length - 1))

      var r = map(wave[index], -1, 1, 150, 350)

      var x = r * sin(i) * t
      var y = r * cos(i)

      // Wave form type
      vertex(x, y)
    }
    endShape()
  }

  // Create background particles
  var p = new Particle()
  particles.push(p)

  // Insert particles into array by using for loop
  for (var i = particles.length - 1; i >= 0; i--) {
    if (!particles[i].edges()) { // Remove particles from array if they goes out of the canvas
      particles[i].update(amp > 230)
      particles[i].show()
    } else {
      particles.splice(i, 1)
    }

  }
}

// Click function on play and pause music
function mouseClicked() {
  if (song.isPlaying()) {
    song.pause()
    noLoop()
  } else {
    song.play()
    loop()
  }
}

// Paticle class
class Particle {
  constructor() {
    this.pos = p5.Vector.random2D().mult(250)
    this.vel = createVector(0, 0)
    this.acc = this.pos.copy().mult(random(0.0001, 0.00001))

    this.w = random(3, 5)

    this.color = [random(200, 255), random(200, 255), random(200, 255)]
  }

  // Control particle acceleration & velocity according to the music
  update(cond) {
    this.vel.add(this.acc)
    this.pos.add(this.vel)
    if (cond) {
      this.pos.add(this.vel)
      this.pos.add(this.vel)
      this.pos.add(this.vel)
    }
  }

  edges() {
    if (this.pos.x < -width / 2 || this.pos.x > width / 2 ||
      this.pos.y < -height / 2 || this.pos.y > height / 2) {
      return true
    } else {
      return false
    }
  }

  // Show particles
  show() {
    noStroke()
    fill(this.color)
    ellipse(this.pos.x, this.pos.y, 4)
  }
}

//  Resize canvas when window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}