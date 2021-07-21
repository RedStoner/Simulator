let buttonWidth = 200;
let buttonHeight = 32;
let topOffset = 5;

class Button {
    constructor(x, label,tool) {
        this.index = x;
        this.label = label;
        this.shown = true;
        this.active = false;
        this.tool = tool
    }
    activate(_v) {
        this.active = _v;
    }
    draw() {
        let x = CanvasSizeX - menuWidth + 5;
        let y = (this.index  + topOffset)* (buttonHeight + 4) ;
        if (this.active) {
            fill(color('#9fdb8f'));
        } else {
            fill(color('#8a8a8a'))
        }
        //stroke(color('#7ec850'));
        stroke(0);
        rect(x, y, buttonWidth, buttonHeight);
        noStroke();
        fill(0);
        text(this.label,x, y, buttonWidth, buttonHeight);
        
    }
    contains(x, y) {
        return (x >= CanvasSizeX - menuWidth + 5 && x <= CanvasSizeX - menuWidth + 5 + buttonWidth && y >= (this.index  + topOffset)* (buttonHeight + 4) && y <= (this.index + topOffset) * (buttonHeight + 4) + buttonHeight ) ;
    }
}