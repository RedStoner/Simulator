//Globals 
let CanvasSizeX;
let CanvasSizeY; 
let Grid = [];
let Canvas;
let menu = new Menu("construction");
let cellSize;
let maxGridX;
let maxGridY;
let currentX = 0;
let currentY = 0;
let selectedX = 0;
let selectedY = 0;
let selectedTool = "none";
let wallet = new Wallet();
let resourceGains;
let gameTick = 0;
let specialPlacement = ["mill", "mine", "farm"];

//Sizing Options
let gridSize = 60;
let menuWidth = 300;
let zoomLevels = [8,16,32,64]

//general Options
let zoomLevel = 2;
let gameRate = 30;

//Generation Options
let totalMines = 6;
let totalFarms = 6;
let totalMills = 6;

//Road Stuff
let RoadNetworks = [];
let startRoadX = Math.floor((gridSize / 3) / 2);


function setup() {
    console.log("Starting Up.");
    frameRate(30);
    CanvasSizeX = windowWidth - 20;
    CanvasSizeY = windowHeight - 20;
    Canvas = createCanvas(CanvasSizeX, CanvasSizeY);
    Canvas.parent('board');
    Canvas.mouseClicked(gameClick);
    zoom(0);
    textAlign(CENTER, CENTER);
    textSize(16);
    for (var x = 0; x < gridSize; x++) {
        Grid[x] = [];
        for (var y = 0; y < gridSize; y++) {
            if (x == 0 || x == gridSize - 1 || y == 0 || y == gridSize - 1) {
                Grid[x][y] = new Cell(x, y, "border", true);
            } else {
                let randTile = Math.random();
                if (randTile > 0.97) {
                    Grid[x][y] = new Cell(x, y, "grass5", true);
                } else if (randTile > 0.75) {
                    Grid[x][y] = new Cell(x, y, "grass4", true);
                } else if (randTile > 0.5) {
                    Grid[x][y] = new Cell(x, y, "grass1", true);
                } else if (randTile > 0.25) {
                    Grid[x][y] = new Cell(x, y, "grass2", true);
                } else {
                    Grid[x][y] = new Cell(x, y, "grass3", true);
                }
            }
        }
    }

    //Place starting road
    console.log("Placing starting Roads");
    Grid[startRoadX][0].build("road",true);
    Grid[startRoadX][1].build("road",true);
    initiateRoads();
    //generate mines
    console.log("Generating Mines");
    let objectsPlaced = 0;
    do {
        let randX = Math.floor(random() * (gridSize - 2)) + 1;
        let randY = Math.floor(random() * (gridSize - 2)) + 1;
        if (isValidChoice(randX,randY)) {
            Grid[randX][randY].setResource("mine");
            objectsPlaced += 1;
            console.log("Placing Mine");
        }
    } while (objectsPlaced <= totalMines);
    //generate farms
    console.log("Generating Farms");
    objectsPlaced = 0;
    do {
        let randX = Math.floor(Math.random() * (gridSize - 2)) + 1;
        let randY = Math.floor(Math.random() * (gridSize - 2)) + 1;
        if (isValidChoice(randX, randY)) {
            Grid[randX][randY].setResource("farm");
            objectsPlaced += 1;
            console.log("Placing Farm");
        }
    } while (objectsPlaced <= totalFarms);
    //generate mills
    console.log("Generating Mills");
    objectsPlaced = 0;
    do {
        let randX = Math.floor(Math.random() * (gridSize - 2)) + 1;
        let randY = Math.floor(Math.random() * (gridSize - 2)) + 1;
        if (isValidChoice(randX, randY)) {
            Grid[randX][randY].setResource("mill");
            objectsPlaced += 1;
            console.log("Placing LumberMill");
        }
    } while (objectsPlaced <= totalMills);
}
function draw() {
    //track game ticks
    gameTick++;
    //do game caculations on timed based cycle
    if (gameTick >= gameRate) {
        gameTick = 0;
        //calculate resource gains
        resourceGains = [];
        for (var x = 0; x < gridSize; x++) {
            for (var y = 0; y < gridSize; y++) {

            }
        }
    }
    clear()
    textSize(zoomLevels[zoomLevel]/2);
    for (var x = 0; x < maxGridX; x++) {
        for (var y = 0; y < maxGridY; y++) {
            if (x + currentX <= Grid.length -1) {
                if (y + currentY <= Grid[x + currentX].length - 1) {
                    Grid[x + currentX][y + currentY].draw(x,y);
                }
            }
            
        }
    }
    textSize(16);
    menu.draw();


    
}
function keyTyped() {
    switch (key) {
        case 'a':
            moveLeft();
            break;
        case 'd':
            moveRight();
            break;
        case 'w':
            moveUp();
            break;
        case 's':
            moveDown();
            break;
        case 'q':
            zoom(-1);
            break;
        case 'e':
            zoom(1);
            break;
    }
    return false
    
}
function moveLeft() {
    console.log("moving left");
    if (currentX - 1 >= 0) {
        currentX += -1;
    }
}
function moveRight() {
    console.log("moving right");
    if (currentX + 1 <= gridSize - maxGridX) {
        currentX += 1;
    }
}
function moveUp() {
    if (currentY - 1 >= 0) {
        currentY += -1;
    }
}
function moveDown() {
    if (currentY + 1 <= gridSize - maxGridY) {
        currentY += 1;
    }
}
function zoom(_l) {
    zoomLevel += _l;
    if (zoomLevel < 0) {
        zoomLevel = 0;
    }
    if (zoomLevel > zoomLevels.length - 1) {
        zoomLevel = zoomLevels.length - 1
    }
    adjustMaxGrids();
    cellSize = zoomLevels[zoomLevel];
    //check if current pos is oob
}

function adjustMaxGrids() {
    maxGridX = Math.floor((CanvasSizeX - menuWidth) / zoomLevels[zoomLevel]);
    maxGridY = Math.floor((CanvasSizeY) / zoomLevels[zoomLevel]);
}

function gameClick() {
    if (mouseButton === LEFT) {
        //check if a cell was clicked
        for (var x = 0; x < maxGridX; x++) {
            for (var y = 0; y < maxGridY; y++) {
                if (x + currentX <= Grid.length - 1) {
                    if (y + currentY <= Grid[x + currentX].length - 1) {
                        let cell = Grid[x + currentX][y + currentY];
                        if (cell.contains(mouseX, mouseY, x, y)) {
                            //set the cell as selected, clear the previous selection
                            cell.selected(true);
                            Grid[selectedX][selectedY].selected(false);
                            selectedX = x + currentX;
                            selectedY = y + currentY;
                            //tool options
                            switch (selectedTool) {
                                case "demo":
                                    cell.demo();
                                    break;
                                default:
                                    cell.build(selectedTool);
                                    break;

                            }
                        }
                    }
                }

            }
        }
        //check if a menu button was clicked
        for (var i = 0; i < menu.buttons.length; i++) {
            if (menu.buttons[i].contains(mouseX, mouseY)) {
                let newState = true;
                selectedTool = "none"
                if (menu.buttons[i].active) {
                    newState = false;
                } 
                for (var j = 0; j < menu.buttons.length; j++) {
                    menu.buttons[j].activate(false);
                }
                menu.buttons[i].activate(newState);
                if (menu.buttons[i].active) {
                    selectedTool = menu.buttons[i].tool;
                } else selectedTool = "none";
                return;
            }
        }
    }
}
function isValidChoice(randX,randY) {
    if (Grid[randX][randY].resource == "none" && Grid[randX][randY].construction.type == "none" && Grid[randX][randY].type != "border" && Grid[randX][randY].type != "water") {
        return true;
    } else {
        return false;
    }
}
function roundTo(_n, _p) {
    Math.floor(_n * (Math.pow(10, _p))) / Math.pow(10, _p);
}
function shrinkNumber(_n) {
    if (_n >= 1e27) {
        //Octillion
        return (_n / 1e27).toFixed(3) + " O";
    } else if (_n >= 1e24) {
        //Septillion
        return (_n / 1e24).toFixed(3) + " S";
    } else if (_n >= 1e21) {
        //Sextillion
        return (_n / 1e21).toFixed(3) + " s";
    } else if (_n >= 1e18) {
        //Quintillion
        return (_n / 1e18).toFixed(3) + " Q";
    } else if (_n >= 1e15) {
        //Quadrillion
        return (_n / 1e15).toFixed(3) + " q";
    } else if (_n >= 1e12) {
        //Trillion
        return (_n / 1e12).toFixed(3) + " t";
    } else if (_n >= 1e9) {
        //Billion
        return (_n / 1e9).toFixed(3) + " b";
    } else if (_n >= 1e6) {
        //Million
        return (_n / 1e6).toFixed(3) + " m";
    } else if (_n >= 1e3) {
        //Thousand
        return (_n / 1e3).toFixed(3) + " k";
    } else {
        return _n;
    }
}


