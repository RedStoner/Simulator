//Globals 
let CanvasSizeX;
let CanvasSizeY; 
let Grid = [];
let Canvas;
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
let resourceNames = ["population", "food", "lumber", "ore"];
let multipliers = { residential: 0, commercial: 0, industrial: 0 };
let ratios = { residential: 0, commercial: 0, industrial: 0 };
let images = [];

//Sizing Options
let gridSize = 60;
let menuWidth = 300;
let zoomLevels = [8,16,32,64]

//general Options
let zoomLevel = 2;
let gameRate = 30;
let taxRate = 0.07;
let saveRate = 30;

//Generation Options
let totalMines = 6;
let totalFarms = 6;
let totalMills = 6;

//Road Stuff
let RoadNetworks = [];
let startRoadX = Math.floor((gridSize / 3) / 2);


let menu = new Menu("construction");

function preload(){
    loadImages();

}
function setup() {
    triangleNumbers(50);
    console.log("Starting Up.");
    frameRate(30);
    CanvasSizeX = document.getElementById("board").offsetWidth - 10;
    CanvasSizeY = windowHeight - 80;
    Canvas = createCanvas(CanvasSizeX, CanvasSizeY);
    Canvas.parent('board');
    zoom(0);
    textAlign(CENTER, CENTER);
    textSize(16);

    if (hasSaveData()) {
        loadGame();
    } else {
        newGame();
    }
    //menu.initialize();
    
}
function draw() {
    //track game ticks
    gameTick++;
    //do game caculations on timed based cycle
    if (gameTick % gameRate == 0) {
        doPayouts();
        if (gameTick % (gameRate * saveRate) == 0) {
            saveGame();
        }
    }
    checkMovement();
    checkClick();
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
    resourceGains = { money: 0, population: 0, ore: 0, lumber: 0, food: 0, residentialSupply: 0, commercialSupply: 0, industrialSupply: 0, residentialDemand: 0, commercialDemand: 0, industrialDemand: 0, popCap: 0 };
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
    //calculate supply demand multipliers
    ratios = { residential: 0, commercial: 0, industrial: 0 };
    let _ave = 0;
    

    for (var key in ratios) {
        //console.log(resourceGains[key+"Supply"]);
        ratios[key] = 0;
        if (resourceGains[key + "Demand"] != 0) {
            ratios[key] =  resourceGains[key + "Supply"] / (resourceGains[key + "Demand"] * -1);
            if (ratios[key] > 1) {
                ratios[key] = 1;
            }
            //console.log((resourceGains[key + "Demand"] * -1) + " / " + resourceGains[key + "Supply"] + " = " + ratios[key]);
        }
        _ave += ratios[key];
    }
    _ave = _ave / 3;
    //console.log("Average: "+ _ave);
    for (var key in ratios) {
        multipliers[key] = (0.4 * _ave) + (0.6 * ratios[key]);
    }

    //console.log(resourceGains);
    Object.keys(resourceGains).map(function (objectKey, index) {
        var value = resourceGains[objectKey];
        if (objectKey == "popCap") {
            //console.log("Adjusting Cap: " + objectKey + " by " + value);
            wallet.setCapPopulation(value);
        } else if (resourceNames.includes(objectKey)) {
            //console.log("Adjusting: " + objectKey + " by " + value);
            switch (objectKey) {
                case "population":
                    wallet.adjust([objectKey, value * multipliers.residential], 1);
                    wallet.setRate([objectKey, value * multipliers.residential], 1);
                    break;
                case "lumber":
                    wallet.adjust([objectKey, value * multipliers.industrial], 1);
                    wallet.setRate([objectKey, value * multipliers.industrial], 1);
                    break;
                case "ore":
                    wallet.adjust([objectKey, value * multipliers.industrial], 1);
                    wallet.setRate([objectKey, value * multipliers.industrial], 1);
                    break;
                case "food":
                    wallet.adjust([objectKey, value * multipliers.commercial], 1);
                    wallet.setRate([objectKey, value * multipliers.commercial], 1);
                    break;
                default:
                    wallet.adjust([objectKey, value], 1);
                    wallet.setRate([objectKey, value], 1);
            }
        } 
    });
    //if (wallet.population[0] >= 1) {
    let _m = wallet.population[0] * taxRate * multipliers.residential
    wallet.adjustMoney(_m);
    wallet.setRateMoney(_m);
    //}



}


function toggleButton(_e) {
    let newState = true;
    selectedTool = "none";
    if (menu.buttons[_e].active) {
        newState = false;
    }
    for (var _b in menu.buttons) {
        menu.buttons[_b].activate(false);
    }
    menu.buttons[_e].activate(newState);
    if (menu.buttons[_e].active) {
        selectedTool = menu.buttons[_e].tool;
        //showToolInfo(_e);
    }
    return;

}



function adjustMaxGrids() {
    maxGridX = Math.floor((CanvasSizeX) / zoomLevels[zoomLevel]);
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
                Grid[x][y] = new Cell(x, y, "border", true, "none", 0, "none");
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
    //generate mines
    console.log("Generating Mines");
    let objectsPlaced = 0;
    do {
        let randX = Math.floor(random() * (gridSize - 2)) + 1;
        let randY = Math.floor(random() * (gridSize - 2)) + 1;
        if (isValidChoice(randX, randY)) {
            Grid[randX][randY].setResource("mine");
            objectsPlaced += 1;
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
        }
    } while (objectsPlaced <= totalMills);
    initiateRoads();
    saveGame();
}
function saveGame() {
    let saveData = [];
    let saveGrid = [];
    for (var x = 0; x < gridSize; x++) {
        saveGrid[x] = [];
        for (var y = 0; y < gridSize; y++) {
            saveGrid[x][y] = Grid[x][y].exportData();
        }
    }
    saveData[0] = [gameTick, gridSize, startRoadX];
    saveData[1] = saveGrid;
    saveData[2] = wallet.exportData();
    localStorage.setItem('saveData',JSON.stringify(saveData));
}
function hasSaveData() { return (localStorage.getItem('saveData') !==null)}
function loadGame() {
    let saveData = JSON.parse(localStorage.getItem('saveData'));
    gameTick = saveData[0][0];
    gridSize = saveData[0][1];
    startRoadX = saveData[0][2];
    for (var x = 0; x < gridSize; x++) {
        Grid[x] = [];
        for (var y = 0; y < gridSize; y++) {
            let _c = saveData[1][x][y];
            Grid[x][y] = new Cell(_c[0], _c[1], _c[2], _c[3], _c[4], _c[5], _c[6]);
        }
    }
    _c = saveData[2]
    wallet = new Wallet(_c[0], _c[1], _c[2], _c[3], _c[4]);
    initiateRoads();
}

function loadImages() {
    images.pick = loadImage('https://redstoner.github.io/Simulator/pick.svg');
    images.axe = loadImage('https://redstoner.github.io/Simulator/axe.png');
    images.hoe = loadImage('https://redstoner.github.io/Simulator/hoe.svg');
}



function triangleNumbers(x) {
    let _t = ""
    let lastTri = 0;
    for (var i = 1; i <= x; i++) {
        _t += (lastTri + i) + ", ";
        lastTri += i;
    }
    console.log(_t);
        
}

