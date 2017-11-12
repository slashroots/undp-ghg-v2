var db = require('../model/db');


/**
 * The function looks for all the IPCC categories and 
 * attempts to create an associated version of it in the
 * local category collection.
 */
lookupAndAssociate = function() {
    db.IPCCCategory.find().exec(function(err, list) {
        for(i in list) {
            var cat = db.Category({
                ca_code: list[i].ica_code,
                ca_code_name: list[i].ica_code_name,
                se_sector: list[i].se_sector,
                ica_category: list[i]._id,
            });
            cat.save();
        }
    })
}

lookupAndAssociate();