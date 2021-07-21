class RoadNetwork {
    constructor(id,master) {
        this.id = id
        this.cells = [];
        this.master = master; //[x, y]
    }
    updateNetwork() {
        //console.log(this.master);
        this.cells = [];
        this.establishConnections(this.master[0], this.master[1]);
    }
    establishConnections(x, y) {
        let cell = Grid[x][y];
        //check for a road that hasnt been checked already.
        if (cell.isRoad() && !cell.roadCheck) {
            //add it to road network and mark it as checked.
            cell.setRoadCheck(true);
            cell.setRoadID(this.id);
            this.cells.push([x, y])
            //check it's neighbors
            for (var i = 0; i < cell.neighbors.length; i++) {
                this.establishConnections(x + cell.neighbors[i][0], y + cell.neighbors[i][1]);
            }
        }
    }
}
function resetRoadChecks(resetIDS) {
    for (var x = 0; x < gridSize; x++) {
        for (var y = 0; y < gridSize; y++) {
            Grid[x][y].setRoadCheck(false);
            Grid[x][y].setRoadID("");
        }
    }
}
function initiateRoads() {
    RoadNetworks[0] = new RoadNetwork(0, [startRoadX, 0]);
    RoadNetworks[0].updateNetwork();
}