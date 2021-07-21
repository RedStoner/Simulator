class Wallet {
    constructor() {
        this.money = [5000,-1];
        this.population = [0,100];
        this.ore = [0,1000];
        this.lumber = [0, 1000];
        this.food = [0, 1000];
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
    setCapFood(_v) {this.food[1] = _v;}
}