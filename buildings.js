class Building {
    constructor(type,level) {
        this.type = type;
        this.level = level;

        this.resourceGains;
        this.resourceCosts;
        this.buildCost;
        this.name;
        this.roadRange = 0;

        //Resource Layout - resourceGains[level][type(0),value(1)]...

        switch (type) {
            case "none":
                this.name = "None";
                this.resourceGains = "none";
                this.resourceCosts = "none";
                this.buildCost = "none";
                break;
            case "road":
                this.name = "Road";
                this.resourceGains = "none";
                this.resourceCosts = "none";
                this.buildCost = [
                    [
                        ["money", 10]
                    ]
                ];
                break;
            case "residential":
                this.name = "Residential";
                this.roadRange = 1;
                this.resourceGains = [
                    [
                        ["popCap", 5],
                        ["population", 0.01],
                        ["residentialSupply", 1]
                    ]
                ];
                this.resourceCosts = [
                    [
                        ["food", 0.01],
                        ["commercialDemand", 0.25]
                    ]
                ];
                this.buildCost = [
                    [
                        ["money", 20]
                    ],
                ];
                break;
            case "commercial":
                this.name = "Commercial";
                this.roadRange = 2;
                this.resourceGains = [
                    [
                        ["commercialSupply", 1]
                    ]
                ];
                this.resourceCosts = [
                    [
                        ["industrialDemand", 1.5],
                        ["residentialDemand", 1.25]
                    ]
                ];
                this.buildCost = [
                    [
                        ["money", 30],
                    ],
                ];
                break;
            case "industrial":
                this.name = "Industrial";
                this.roadRange = 3;
                this.resourceGains = [
                    [
                        ["industrialSupply", 1]
                    ]
                ];
                this.resourceCosts = [
                    [
                        ["commercialDemand", 0.5],
                        ["residentialDemand", 0.5]
                    ]
                ];
                this.buildCost = [
                    [
                        ["money", 30]
                    ],
                ];
                break;
            case "mine":
                this.name = "Ore Mine";
                this.roadRange = 1;
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
                this.name = "Lumber Mill";
                this.roadRange = 1;
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
                this.name = "Farmland";
                this.roadRange = 1;
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