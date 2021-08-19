let maze;

function setup() {
    createCanvas(600, 600, SVG);
    maze = new Maze(4, 9);
    maze.completePath()
    maze.drawLabyrinth()
}

class Maze {
    constructor(w, h) {
        this.w = w;
        this.h = h;
        this.nodes = [];
        this.path = [];
        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                const node = new Node(x, y);
                this.nodes.push(node);
            }
        }
        this.nodes[this.nodes.length - 1].exit = true;
        this.addToPath(this.nodes[0])
        this.nodes.forEach(node => {
            const left = this.getNode(node.x - 1, node.y);
            const right = this.getNode(node.x + 1, node.y);
            const up = this.getNode(node.x, node.y - 1);
            const down = this.getNode(node.x, node.y + 1);
            if (left) {
                node.options.push(left)
            }
            if (right) {
                node.options.push(right)
            }
            if (up) {
                node.options.push(up)
            }
            if (down) {
                node.options.push(down)
            }
        })
    }
    getNode(x, y) {
        return this.nodes.find(node => node.x === x & node.y === y);
    }
    addToPath(node) {
        node.visited = true;
        this.path.push(node);
    }
    advancePath() {
        const current = this.path[this.path.length - 1];
        const canTry = []
        current.options.forEach(option => {
            if (this.path.length === this.nodes.length - 1 && option.exit) {
                canTry.push(option)
            }
            if (!option.visited && !current.tries.includes(option) && !option.exit) {
                canTry.push(option)
            }
        })
        if (canTry.length === 0) {
            current.visited = false;
            current.tries = [];
            this.path.pop()
            return
        }
        const next = random(canTry);
        current.tries.push(next);
        this.addToPath(next);

    }
    completePath() {
        while (this.nodes.length > this.path.length) {
            this.advancePath()
        }
    }
    draw() {
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
        pop()
    }
    drawLabyrinth() {
        const maxDiameter = max(width, height) * 0.9;
        const spacing = maxDiameter / (this.h * 2);
        const arcLength = TAU / this.w;
        push()
            translate(width/2, height/2)
            strokeWeight(2)
            noFill()
            for (let node = 0; node < this.path.length; node++) {
                const current = this.path[node];
                const currentPos = p5.Vector.fromAngle(arcLength * current.x)
                currentPos.mult(current.y * spacing + spacing)
                if (node === 0) {
                    line(0, 0, currentPos.x, currentPos.y)
                } else {
                    const previous = this.path[node-1];
                    const previousPos = p5.Vector.fromAngle(arcLength * previous.x)
                    previousPos.mult(previous.y * spacing + spacing)
                    if (current.x == previous.x) {
                        line(previousPos.x, previousPos.y, currentPos.x, currentPos.y)
                    } else {
                        let startAngle = previousPos.heading()
                        let endAngle = currentPos.heading()
                        if (previous.x > current.x) {
                            startAngle = currentPos.heading()
                            endAngle = previousPos.heading()
                        }
                        const diameter = previousPos.mag() * 2
                        arc(0,0, diameter, diameter, startAngle, endAngle)
                    }
                }            
            }
            endShape()
        pop()
    }
}

class Node {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.exit = false;
        this.visited = false;
        this.options = [];
        this.tries = [];
    }
}