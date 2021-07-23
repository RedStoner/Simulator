class Button {
    constructor(id) {
        this.shown = true;
        this.active = false;
        this.tool = id;
    }
    activate(_v) {
        this.active = _v;
        if (_v) {
            document.getElementById(this.tool).style.background = '#9fdb8f';
        } else {
            document.getElementById(this.tool).style.background = '#8a8a8a';
        }
    }
}