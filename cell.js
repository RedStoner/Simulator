class Cell {
    constructor(x, y, type, unlock) {
        this.unlocked = unlock;
        this.xIndex = x;
        this.yIndex = y;
        this.type = type;
        this.color;
        this.clicked = false;
        this.construction = new Building("none");
        this.resource = "none";
        this.roadCheck = false;
        this.roadID = "";
        this.neighbors = this.setNeighbors();

        switch (type) {
            case "dirt":
                this.color = color('#c49f44');
                break;
            case "grass5":
                this.color = color('#a5d985'); 
                break;
            case "grass4":
                this.color = color('#7bd741');
                break;
            case "grass3":
                this.color = color('#81bc5c');
                break;
            case "grass2":
                this.color = color('#62aa36');
                break;
            case "grass1":
                this.color = color('#7ec850');
                break;
            default:
                this.color = color('#000000');
        }
    }
    getInfo() {
        return this.xIndex, this.yIndex, this.type;
    }

    draw(_x, _y) {
        let x = _x * cellSize;
        let y = _y * cellSize;
        noStroke();
        //Shade roads grey
        switch (this.construction.type) {
            case "road":
                this.road(x, y);
                break;
            case "residential":
                this.residential(x, y);
                break;
            case "commercial":
                this.commercial(x, y);
                break;
            case "industrial":
                this.industrial(x, y);
                break;
            case "mine":
                this.grass(x, y);
                this.mine(x, y);
                break;
            case "mill":
                this.grass(x, y);
                this.mill(x, y);
                break;
            case "farm":
                this.grass(x, y);
                this.farm(x, y);
                break;
            default:
                this.grass(x, y);
        }
        //label resources
        if (this.resource == "mine") {
            fill(255);
            text("M", x, y, cellSize, cellSize);
        } else if (this.resource == "farm") {
            fill(0);
            text("F", x, y, cellSize, cellSize);
        } else if (this.resource == "mill") {
            fill(0);
            text("L", x, y, cellSize, cellSize);
        }
        strokeWeight(4);
        if (this.contains(mouseX, mouseY, _x, _y)) {
            stroke('red');
            fill(color('rgba(0,0,0,0)'));
            square(x + 2, y + 2, cellSize - 4);
        } else if (this.clicked) {
            stroke(0);
            fill(color('rgba(0,0,0,0)'));
            square(x + 2, y + 2, cellSize - 4);
        }
    }

    contains (x, y, _x, _y) {
        let checkx = _x * cellSize;
        let checky = _y * cellSize;
        return (x >= checkx && x < checkx + cellSize && y >= checky && y < checky + cellSize);
    }

    selected(_s) {
        this.clicked = _s;
    }

    build(_c,forcedBuild) {
        if (forcedBuild) {
            this.construction = new Building(_c);
            return true;
        }
        if (this.construction.type == "none" && this.resource == "none" && this.type != "border") {
            if (!specialPlacement.includes(_c)) {
                this.construction = new Building(_c);
                if (_c == "road") {
                    resetRoadChecks();
                    RoadNetworks[0].updateNetwork();
                }
                return true;
            }
        } else if (this.construction.type == "none" && this.resource != "none") {
            if (_c == this.resource) {
                this.construction = new Building(_c);
                return true;
            }
        }
    }

    demo() {
        // check if this is the staring road
        if (!(this.xIndex == startRoadX && this.yIndex == 1) && this.type != "border") {
            this.construction = new Building("none");
            if (this.construction.type == "road") {
                resetRoadChecks();
                RoadNetworks[0].updateNetwork();
            }
        }
    }

    setResource(_r) { this.resource = _r; }

    setNeighbors() {
        let _n = [];
        if (this.xIndex - 1 >= 0) { _n.push([-1, 0]); }
        if (this.xIndex + 1 < gridSize) { _n.push([1, 0]); }
        if (this.yIndex - 1 >= 0) { _n.push([0, -1]); }
        if (this.yIndex + 1 < gridSize) { _n.push([0, 1]); }
        return _n;
    }

    //Road Calls
    setRoadCheck(_b) { this.roadCheck = _b; }
    isRoad() { return (this.construction.type == "road"); }
    setRoadID(_n) { this.roadID = _n; }
    connectedToRoad(reach) {
        for (var i = 0; i < this.neighbors.length; i++) {
            for (var r = 1; r <= reach; r++) {
                if (this.xIndex + (this.neighbors[i][0] * r) >= 0 && this.xIndex + (this.neighbors[i][0] * r) < gridSize &&
                    this.yIndex + (this.neighbors[i][1] * r) >= 0 && this.yIndex + (this.neighbors[i][1] * r) < gridSize) {
                    let _nCell = Grid[this.xIndex + (this.neighbors[i][0] * r)][this.yIndex + (this.neighbors[i][1] * r)];
                    if (_nCell.isRoad() && _nCell.roadID == "0") {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    //Tile Draws
    road(x, y) {
        fill(color('#8a8a8a'));
        //stroke(color('#8a8a8a'));
        square(x, y, cellSize);
        if (this.roadID != "0") {
            fill(color('#ff0000'));
            text("!", x, y, cellSize, cellSize);
        }
    }

    grass(x, y) {
        noStroke();
        fill(this.color);
        square(x, y, cellSize);
    }

    residential(x, y) {
        strokeWeight(4);
        stroke(color('#00ff00'));
        fill(color('rgba(0, 255, 0, 0.25)'));
        square(x + 2, y + 2, cellSize - 4);
        noStroke();
        if (!this.connectedToRoad(2)) {
            fill(color('#ff0000'));
            text("!", x, y, cellSize, cellSize);
        }
    }
    commercial(x, y) {
        strokeWeight(4);
        stroke(color('#0000ff'));
        fill(color('rgba(0,0,255,0.25)'));
        square(x + 2, y + 2, cellSize - 4);
        noStroke();
        if (!this.connectedToRoad(1)) {
            fill(color('#ff0000'));
            text("!", x, y, cellSize, cellSize);
        }
    }
    industrial(x, y) {
        strokeWeight(4);
        stroke(color('#ffff00'))
        fill(color('rgba(255,255,0,0.25)'));
        square(x + 2, y + 2, cellSize - 4);
        noStroke();
        if (!this.connectedToRoad(3)) {
            fill(color('#ff0000'));
            text("!", x, y, cellSize, cellSize);
        }
    }
    mine(x, y) {
        strokeWeight(4);
        stroke(color('#b0b0b0'));
        fill(color('rgba(0,0,0,0)'));
        square(x + 2, y + 2, cellSize - 4);
        noStroke();
        if (!this.connectedToRoad(1)) {
            fill(color('#ff0000'));
            text("!", x, y, cellSize, cellSize);
        }

    }
    mill(x, y) {
        strokeWeight(4);
        stroke(color('#ffffff'));
        fill(color('rgba(0,0,0,0)'));
        square(x + 2, y + 2, cellSize - 4);
        noStroke();
        if (!this.connectedToRoad(1)) {
            fill(color('#ff0000'));
            text("!", x, y, cellSize, cellSize);
        }

    }
    farm(x, y) {
        stroke(color('#ffffff'));
        strokeWeight(4);
        fill(color('rgba(0,0,0,0)'));
        square(x + 2, y + 2, cellSize - 4);
        noStroke();
        if (!this.connectedToRoad(1)) {
            fill(color('#ff0000'));
            text("!", x, y, cellSize, cellSize);
        }

    }

}
