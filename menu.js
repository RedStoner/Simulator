class Menu {
    constructor (_t){
        this.type = _t;
        this.buttons = [
            new Button(0, "Demolish", "demo"),
            new Button(1, "Road", "road"),
            new Button(2, "Residential", "residential"),
            new Button(3, "Commercial", "commercial"),
            new Button(4, "Industrial", "industrial"),
            new Button(5, "Mine", "mine"),
            new Button(6, "Lumber Mill", "mill"),
            new Button(7, "Farm", "farm"),
        ];
    }
    draw() {
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].draw()
        }
        let x = CanvasSizeX - menuWidth + 5;
        let y = 0;
        fill(180);
        rect(x, y, menuWidth, (buttonHeight + 3) * topOffset);
        fill(0);
        textAlign(LEFT, CENTER);
        let _t = " Money: " + shrinkNumber(wallet.money[0]);
        text(_t, x, y, menuWidth, (buttonHeight + 3));
        y += buttonHeight + 3;
        _t = " Pop: " + shrinkNumber(wallet.population[0]) + " / " + shrinkNumber(wallet.population[1]);
        text(_t, x, y, menuWidth, (buttonHeight + 3));
        y += buttonHeight + 3;
        _t = " Ore: " + shrinkNumber(wallet.ore[0]) + " / " + shrinkNumber(wallet.ore[1]);
        text(_t, x, y, menuWidth, (buttonHeight + 3));
        y += buttonHeight + 3;
        _t = " Lumber: " + shrinkNumber(wallet.lumber[0]) + " / " + shrinkNumber(wallet.lumber[1]);
        text(_t, x, y, menuWidth, (buttonHeight + 3));
        y += buttonHeight + 3;
        _t = " Food: " + shrinkNumber(wallet.food[0]) + " / " + shrinkNumber(wallet.food[1]);
        text(_t, x, y, menuWidth, (buttonHeight + 3));
        textAlign(CENTER, CENTER);
    }

}