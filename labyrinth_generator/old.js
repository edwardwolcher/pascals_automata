function setup() {
    createCanvas(600, 600);
    grid = new Grid(7,7);
    grid.completePath();
  }
  
  function draw() {
    background(220);
    grid.drawOutlines();
    grid.drawPath();
  }

class Grid {
  constructor(w,h) {
    this.w = w;
    this.h = h;
    this.nodes = [];
    this.path = [];
    this.finished = false;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const node = new Node(x, y)
        this.nodes.push(node)
      }
    }
    this.nodes[this.nodes.length -1].exit = true;
    this.nodes[0].visited = true;
    this.path.push(this.nodes[0])
  }
  getNode(x, y) {
    return this.nodes.find(node => node.x === x & node.y ===y);
  }
  drawOutlines() {
    const xSpacing = width / this.w;
    const ySpacing = height / this.h;
    push()
      this.nodes.forEach(node => {
        push();
        stroke(4);
        noFill();
        if (node.exit) {
          fill("pink")
        }
        rect(node.x * xSpacing, node.y * ySpacing, xSpacing, ySpacing);
        pop();
      })
    pop()
  }
  drawPath() {
    const xSpacing = width / this.w;
    const ySpacing = height / this.h;
    this.path.forEach((node, i) => {
      const x = node.x * xSpacing + xSpacing / 2;
      const y = node.y * ySpacing + ySpacing / 2;
      push()
        noStroke();
        fill("green");
        circle(x, y, xSpacing / 4)
      pop()
      if (i > 0) {
        const prevX = this.path[i - 1].x * xSpacing + xSpacing / 2;
        const prevY = this.path[i - 1].y * ySpacing + ySpacing / 2;
        stroke(4)
        line(prevX, prevY, x, y);
      }
    })
  }
  advancePath() {
    if (this.path.length === this.nodes.length) {
      this.finished = true;
      return
    }
    const current = this.path[this.path.length -1];
    if (current.x < this.w - 1 && !this.getNode(current.x + 1, current.y).visited) {
      current.options.push(this.getNode(current.x + 1, current.y));
    }
    if (current.x > 0 && !this.getNode(current.x - 1, current.y).visited) {
      current.options.push(this.getNode(current.x - 1, current.y));
    }  
    if (current.y < this.h - 1 && !this.getNode(current.x, current.y +1).visited) {
      current.options.push(this.getNode(current.x, current.y +1));
    }
    if (current.y > 0 && !this.getNode(current.x, current.y -1).visited) {
      current.options.push(this.getNode(current.x, current.y -1));
    }
    if (current.options.length < 1) {
      while(true) {
        const newCurrent = this.path[this.path.length-1];
        console.log(newCurrent)
        if (newCurrent.options > 1) {
          return
        }
        this.path.pop()
      }

    }
    const choice = random(current.options);
    choice.visited = true;
    this.path.push(choice)

  }
  completePath() {
    while(!this.finished) {
      this.advancePath();
    }
  }
}



class Node {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.options = [];
    this.visited = false;
    this.exit = false;
  }
}