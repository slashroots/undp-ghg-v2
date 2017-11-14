var db = require('../model/db');

var activities = [
"Avgas",
"Aviation Gasoline",
"Bagasse",
"Charcoal",
"Coal",
"Diesel oil",
"Fuel Oil",
"Gas/diesel oil",
"Gasoline",
"Jet Kerosene",
"Kerosene",
"LPG",
"Motor gasoline",
"Natural gas",
"Other Primary Solid Biomass",
"Turbo",
"Wood"
];

importActivity = function() {
    for(i in activities) {
        var activity = db.Activity({
            ac_name: activities[i],
            us_user: "59753be7ed53b2001110022d"
        });
        activity.save(function(success) {
            console.log(success);
        });
    }
};

importActivity();