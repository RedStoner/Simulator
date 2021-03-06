function keyTyped() {
    switch (key) {
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
function checkMovement(){
    if (keyIsPressed === true) {
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
        }

    }
}
function checkClick(){
    if (mouseIsPressed) {
        if (mouseButton === LEFT) {
            //check if a cell was clicked
            for (var x = 0; x < maxGridX; x++) {
                for (var y = 0; y < maxGridY; y++) {
                    if (x + currentX <= Grid.length - 1) {
                        if (y + currentY <= Grid[x + currentX].length - 1) {
                            let cell = Grid[x + currentX][y + currentY];
                            if (cell.contains(mouseX, mouseY, x, y)) {
                                //set the cell as selected, clear the previous selection
                                if (!(selectedX == x + currentX && selectedY == y + currentY)) {
                                    cell.selected(true);
                                    Grid[selectedX][selectedY].selected(false);
                                    selectedX = x + currentX;
                                    selectedY = y + currentY;
                                }
                                //tool options
                                switch (selectedTool) {
                                    case "demo":
                                        cell.demo();
                                        break;
                                    case "none":
                                        menu.showSelected(cell);
                                    default:
                                        cell.build(selectedTool, 0);
                                        break;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}