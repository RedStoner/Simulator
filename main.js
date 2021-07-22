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
let wallet;
let resourceGains;
let gameTick = 0;
let specialPlacement = ["mill", "mine", "farm"];
let demandNames = ["residential", "commercial", "industrial"];
let demands = { residential: 0, commercial: 0, industrial: 0 };

//Sizing Options
let gridSize = 60;
let menuWidth = 300;
let zoomLevels = [8,16,32,64]

//general Options
let zoomLevel = 2;
let gameRate = 30;
let taxRate = 0.07;

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


    newGame();

    
}
function draw() {
    //track game ticks
    gameTick++;
    //do game caculations on timed based cycle
    if (gameTick >= gameRate) {
        gameTick = 0;
        doPayouts();
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
function doPayouts() {
    //calculate resource gains
    //wallet.adjustMoney(10);
    resourceGains = { money: 0, population: 0, ore: 0, lumber: 0, food: 0, residential: 0, commercial:  0, industrial: 0, popCap: 0 };
    for (var x = 0; x < gridSize; x++) {
        for (var y = 0; y < gridSize; y++) {
            let cell = Grid[x][y];
            if (cell.construction.type != "none") {
                if (cell.connectedToRoad()) {
                    //console.log("adding resources for: " + cell.construction.type);
                    let _con;
                    if (cell.construction.resourceGains != "none") {
                        _con = cell.construction.resourceGains[cell.construction.level];
                        for (var i = 0; i < _con.length; i++) {
                            resourceGains[_con[i][0]] += _con[i][1];
                        }
                    }
                    if (cell.construction.resourceCosts != "none") {
                        _con = cell.construction.resourceCosts[cell.construction.level];
                        for (var i = 0; i < _con.length; i++) {
                            resourceGains[_con[i][0]] -= _con[i][1];
                        }
                    }
                }
            }
        }
    }
    //console.log(resourceGains);
    Object.keys(resourceGains).map(function (objectKey, index) {
        var value = resourceGains[objectKey];
        if (objectKey == "popCap") {
            //console.log("Adjusting Cap: " + objectKey + " by " + value);
            wallet.setCapPopulation(value);
        } else if (demandNames.includes(value)) {
            //console.log("Adjusting Demand: " + objectKey + " by " + value);
            demands[objectKey] = value;
        } else {
            //console.log("Adjusting: " + objectKey + " by " + value);
            wallet.adjust([objectKey, value], 1);
            wallet.setRate([objectKey, value], 1);
        }
    });
    //if (wallet.population[0] >= 1) {
    wallet.adjustMoney(wallet.population[0] * taxRate);
    wallet.setRateMoney(wallet.population[0] * taxRate);
    //}



}

function adjustMaxGrids() {
    maxGridX = Math.floor((CanvasSizeX - menuWidth) / zoomLevels[zoomLevel]);
    maxGridY = Math.floor((CanvasSizeY) / zoomLevels[zoomLevel]);
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
        return _n.toFixed(3);
    }
}

function newGame() {
    //Create the board
    wallet = new Wallet([500,-1,0],[0,0,0],[0,1000,0],[0, 1000,0],[500, 1000,0])
    for (var x = 0; x < gridSize; x++) {
        Grid[x] = [];
        for (var y = 0; y < gridSize; y++) {
            if (x == 0 || x == gridSize - 1 || y == 0 || y == gridSize - 1) {
                Grid[x][y] = new Cell(x, y, "border", true);
            } else {
                let randTile = Math.random();
                if (randTile > 0.97) {
                    Grid[x][y] = new Cell(x, y, "grass5", true, "none", 0, "none");
                } else if (randTile > 0.75) {
                    Grid[x][y] = new Cell(x, y, "grass4", true, "none", 0, "none");
                } else if (randTile > 0.5) {
                    Grid[x][y] = new Cell(x, y, "grass1", true, "none", 0, "none");
                } else if (randTile > 0.25) {
                    Grid[x][y] = new Cell(x, y, "grass2", true, "none", 0, "none");
                } else {
                    Grid[x][y] = new Cell(x, y, "grass3", true, "none", 0, "none");
                }
            }
        }
    }
    //Place starting road
    console.log("Placing starting Roads");
    Grid[startRoadX][0].build("road", 0, true);
    Grid[startRoadX][1].build("road", 0, true);
    initiateRoads();
    //generate mines
    console.log("Generating Mines");
    let objectsPlaced = 0;
    do {
        let randX = Math.floor(random() * (gridSize - 2)) + 1;
        let randY = Math.floor(random() * (gridSize - 2)) + 1;
        if (isValidChoice(randX, randY)) {
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
