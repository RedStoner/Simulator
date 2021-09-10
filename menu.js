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
        this.notifications = [
            ["",0],
            ["",0],
            ["",0]
        ];
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
    showNotifications() {
        for (var i = 0; i < 3; i++) {
            document.getElementById("notify" + (i + 1)).innerHTML = this.notifications[i][0];
            if (this.notifications[i][1] > 0) {
                this.notifications[i][1] -= 1;
            }
        }
        for (var i = 2; i >= 0; i--) {
            document.getElementById("notify" + (i + 1)).innerHTML = this.notifications[i][0];
        }
    }
    addNotification(_text,_time) {
        if (this.notifications[0][0] == "") {
            this.notifications[0] = [_text, _time];
            return;
        }
        if (this.notifications[1][0] == "") {
            this.notifications[1] = [_text, _time];
            return;
        }
        if (this.notifications[2][0] == "") {
            this.notifications[2] = [_text, _time];
            return;
        }
        //force notification push if it does not  fit by shifting all down.
    }
    shiftDown() {
        this.notifications[0] = this.notifications[1];
        this.notifications[1] = this.notifications[2];
        this.notifications[2] = ["", 0];
        if (this.notifications[0][0] == "" && this.notifications[1][0] != "") {
            shiftDown();
        }
    }

    showToolInfo(_t) {
        if (_t == "none") {
            document.getElementById("selectedinfo").style.display = "none";
        } else if (_t == "demo") {
            document.getElementById("selectedinfo").style.display = "block";
            document.getElementById("sname").innerHTML = "Demolish";
            document.getElementById("scost").innerHTML = "FREE";
            document.getElementById("sincome").innerHTML = "";
            document.getElementById("supkeep").innerHTML = "";

        } else {
            document.getElementById("selectedinfo").style.display = "block";
            var bInfo = new Building(_t, 0);
            document.getElementById("sname").innerHTML = bInfo.name;
            if (bInfo.buildCost != "none") {
                document.getElementById("scost").innerHTML = this.makeIntoRows(bInfo.buildCost[0])
            } else {
                document.getElementById("scost").innerHTML = "";
            }

            if (bInfo.resourceGains != "none") {
                document.getElementById("sincome").innerHTML = this.makeIntoRows(bInfo.resourceGains[0])
            } else {
                document.getElementById("sincome").innerHTML = "";
            }

            if (bInfo.resourceCosts != "none") {
                document.getElementById("supkeep").innerHTML = this.makeIntoRows(bInfo.resourceCosts[0])
            } else {
                document.getElementById("supkeep").innerHTML = "";
            }
        }
    }

    makeIntoRows(_data) {
        //console.log(_data);
        var _s = "";
        _data.forEach(element => _s += "<tr><td>" + element[0] + "</td><td>" + element[1]);
        return _s;
    }
}
