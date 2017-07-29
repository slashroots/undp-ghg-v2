var model = require('../../model/db');
var Category = model.Category
var Sector = model.Sector

exports.getCategory = function(req, res, next) {
    Category.find()
        .exec(function(err, docs) {
            if(err) {
                next(err);
            } else {
                res.send(docs);
            }
        });
};

exports.createCategory = function(req, res, next) {
    var category = new Category(req.body);
    category.save(function(err) {
        if(err) {
            next(err);
        } else {
            res.send(app);
        }
    });
};

exports.getSector = function(req, res, next) {
    Sector.find()
        .exec(function(err, docs) {
            if(err) {
                next(err);
            } else {
                res.send(docs);
            }
        });
};

exports.createSector = function(req, res, next) {
    var sector = new Sector(req.body);
    sector.save(function(err) {
        if(err) {
            next(err);
        } else {
            res.send(sector);
        }
    });
};
