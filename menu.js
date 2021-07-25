class Menu {
    constructor (_t){
        this.type = _t;
        this.buttons = {
            demo: new Button("demo"),
            road: new Button("road"),
            residential: new Button("residential"),
            commercial: new Button("commercial"),
            industrial: new Button("industrial"),
            mine: new Button("mine"),
            mill: new Button("mill"),
            farm: new Button("farm"),
        };
    }
    

    draw() {
        let _t = " Money: " + shrinkNumber(wallet.money[2]) + "/s  " + shrinkNumber(wallet.money[0]);
        document.getElementById("money").innerHTML = _t;

        _t = " Pop: " + shrinkNumber(wallet.population[2]) + "/s  " + shrinkNumber(wallet.population[0]) + " / " + shrinkNumber(wallet.population[1]);
        document.getElementById("population").innerHTML = _t;

        _t = " Ore: " + shrinkNumber(wallet.ore[2]) + "/s  " + shrinkNumber(wallet.ore[0]) + " / " + shrinkNumber(wallet.ore[1]);
        document.getElementById("ore").innerHTML = _t;

        _t = " Lumber: " + shrinkNumber(wallet.lumber[2]) + "/s  " + shrinkNumber(wallet.lumber[0]) + " / " + shrinkNumber(wallet.lumber[1]);
        document.getElementById("lumber").innerHTML = _t;

        _t = " Food: " + shrinkNumber(wallet.food[2]) + "/s  " + shrinkNumber(wallet.food[0]) + " / " + shrinkNumber(wallet.food[1]);
        document.getElementById("food").innerHTML = _t;

        document.getElementById("residentialSD").style.height = Math.floor(ratios.residential * 100 + .5) + "%";
        document.getElementById("commercialSD").style.height = Math.floor(ratios.commercial * 100 + .5) + "%";
        document.getElementById("industrialSD").style.height = Math.floor(ratios.industrial * 100 + .5) + "%";

        document.getElementById("residentialSD").innerHTML = Math.floor(ratios.residential * 100 + .5) + "%";
        document.getElementById("commercialSD").innerHTML = Math.floor(ratios.commercial * 100 + .5) + "%";
        document.getElementById("industrialSD").innerHTML = Math.floor(ratios.industrial * 100 + .5) + "%";

    }

}