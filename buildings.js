class Building {
    constructor(type,level) {
        this.type = type;
        this.level = level;


        this.resourceGains;
        this.resourceCosts;
        this.buildCost;

        //Resource Layout - resourceGains[level][type(0),value(1)]...

        switch (type) {
            case "none":
                this.resourceGains = "none";
                this.resourceCosts = "none";
                this.buildCost = "none";
                break;
            case "road":
                this.resourceGains = "none";
                this.resourceCosts = "none";
                this.buildCost = [
                    [
                        ["money", 10]
                    ]
                ];
                break;
            case "residential":
                this.resourceGains = [
                    [
                        ["popCap", 5],
                        ["pop", 0.01],
                        ["residential", 1.5]
                    ]
                ];
                this.resourceCosts = [
                    [
                        ["food", 0.01],
                        ["commercial", 2]
                    ]
                ];
                this.buildCost = [
                    [
                        ["money", 20]
                    ],
                ];
                break;
            case "commercial":
                this.resourceGains = [
                    [
                        ["commercial", 1]
                    ]
                ];
                this.resourceCosts = [
                    [
                        ["industrial", 2],
                        ["residential", 0.25]
                    ]
                ];
                this.buildCost = [
                    [
                        ["money", 30],
                    ],
                ];
                break;
            case "industrial":
                this.resourceGains = [
                    [
                        ["industrial", 1]
                    ]
                ];
                this.resourceCosts = [
                    [
                        ["commercial", 0.5],
                        ["residential", 0.5]
                    ]
                ];
                this.buildCost = [
                    [
                        ["money", 30]
                    ],
                ];
                break;
            case "mine":
                this.resourceGains = [
                    [
                        ["ore", 25]
                    ]
                ];
                this.resourceCosts = [
                    [
                        ["industrial", 20],
                        ["residential", 5]
                    ]
                ];
                this.buildCost = [
                    [
                        ["money", 100]
                    ],
                ];
                break;
            case "mill":
                this.resourceGains = [
                    [
                        ["lumber", 25]
                    ]
                ];
                this.resourceCosts = [
                    [
                        ["industrial", 20],
                        ["residential", 5]
                    ]
                ];
                this.buildCost = [
                    [
                        ["money", 100]
                    ],
                ];
                break;
            case "farm":
                this.resourceGains = [
                    [
                        ["food", 2]
                    ]
                ];
                this.resourceCosts = [
                    [
                        ["industrial", 20],
                        ["residential", 5]
                    ]
                ];
                this.buildCost = [
                    [
                        ["money", 100]
                    ],
                ];
                break;
        }
    }
}