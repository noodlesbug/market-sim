let buyers = [];
let sellers = [];
let trades = [];

function setup() {
  createCanvas(800, 500);
  for (let i = 0; i < 25; i++) {
    buyers.push(new Agent('buyer'));
    sellers.push(new Agent('seller'));
  }
}

function draw() {
  background(240);

  // Draw and move agents
  for (let b of buyers) b.update();
  for (let s of sellers) s.update();

  // Check for trades
  for (let i = buyers.length - 1; i >= 0; i--) {
    for (let j = sellers.length - 1; j >= 0; j--) {
      if (buyers[i].pos.dist(sellers[j].pos) < 10) {
        if (buyers[i].price >= sellers[j].price) {
          trades.push(new Trade(buyers[i].pos.copy()));
          buyers.splice(i, 1);
          sellers.splice(j, 1);
          break;
        }
      }
    }
  }

  // Draw trades
  for (let t of trades) t.show();

  // Labels
  fill(0);
  textSize(16);
  text(`Buyers: ${buyers.length}`, 10, 20);
  text(`Sellers: ${sellers.length}`, 10, 40);
  text(`Trades: ${trades.length}`, 10, 60);
}

class Agent {
  constructor(type) {
    this.type = type;
    this.pos = createVector(random(width), random(height));
    this.vel = p5.Vector.random2D();
    this.price = this.type === 'buyer' 
      ? random(40, 100) // max price
      : random(0, 60);  // min price
  }

  update() {
    this.pos.add(this.vel);
    this.edges();
    fill(this.type === 'buyer' ? 'blue' : 'red');
    noStroke();
    ellipse(this.pos.x, this.pos.y, 10);
  }

  edges() {
    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
  }
}

class Trade {
  constructor(pos) {
    this.pos = pos;
    this.life = 100;
  }

  show() {
    fill(0, 200, 0, this.life);
    noStroke();
    ellipse(this.pos.x, this.pos.y, 12);
    this.life -= 1;
  }
}
