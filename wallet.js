class Wallet {
    constructor() {
        this.money = [500,-1,0];
        this.population = [0,0,0];
        this.ore = [0,1000,0];
        this.lumber = [0, 1000,0];
        this.food = [500, 1000,0];
    }
    adjustMoney(_q, _set) {
        if (_set) {
            this.money[0] = _q;
        } else if (this.money[0] + _q < 0) {
            return false;
        } else {
            this.money[0] += _q;
            return true;
        }
    }
    adjustPopulation(_q, _set) {
        if (_set) {
            this.population[0] = _q;
        } else if (this.population[0] + _q >= 0) {
            this.population[0] += _q;
        }
    }
    adjustOre(_q, _set) {
        if (_set) {
            this.ore[0] = _q;
        } else if (this.ore[0] + _q >= 0) {
            this.ore[0] += _q;
        }
    }
    adjustLumber(_q, _set) {
        if (_set) {
            this.lumber[0] = _q;
        } else if (this.lumber + _q >= 0) {
            this.lumber += _q;
        }
    }
    adjustFood(_q, _set) {
        if (_set) {
            this.food[0] = _q;
        } else if (this.food[0] + _q < 0) {
            return false;
        } else {
            this.food[0] += _q;
            return true;
        }
    }
    setCapMoney(_v) {this.money[1] = _v;}
    setCapPopulation(_v) {this.population[1] = _v;}
    setCapOre(_v) {this.ore[1] = _v;}
    setCapLumber(_v) {this.lumber[1] = _v;}
    setCapFood(_v) { this.food[1] = _v; }

    setRateMoney(_v) {this.money[2] = _v;}
    setRatePopulation(_v) {this.population[2] = _v;}
    setRateOre(_v) {this.ore[2] = _v;}
    setRateLumber(_v) {this.lumber[2] = _v;}
    setRateFood(_v) { this.food[2] = _v; }
    hasEnough(_c) {
        switch (_c[0]) {
            case "money":
                return (this.money[0] >= _c[1]);
            case "population":
                return (this.population[0] >= _c[1]);
            case "ore":
                return (this.ore[0] >= _c[1]);
            case "lumber":
                return (this.lumber[0] >= _c[1]);
            case "food":
                return (this.food[0] >= _c[1]);
        }
    }
    adjust(_c, _m) {
        switch (_c[0]) {
            case "money":
                this.adjustMoney(_c[1] * _m);
                return;
            case "population":
                this.adjustPopulation(_c[1] * _m);
                return;
            case "ore":
                this.adjustOre(_c[1] * _m);
                return;
            case "lumber":
                this.adjustLumber(_c[1] * _m);
                return;
            case "food":
                this.adjustFood(_c[1] * _m);
                return;
        }
    }
    setRate(_c) {
        switch (_c[0]) {
            case "money":
                this.setRateMoney(_c[1]);
                return;
            case "population":
                this.setRatePopulation(_c[1]);
                return;
            case "ore":
                this.setRateOre(_c[1]);
                return;
            case "lumber":
                this.setRateLumber(_c[1]);
                return;
            case "food":
                this.setRateFood(_c[1]);
                return;
        }
        
    }
}