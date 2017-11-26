/**
 * This should be run before starting the application.
 * 
 * Will create a default administrative account with the credentials 
 * entered here.  Please remove this file from the server after a 
 * successful run.
 */
var Crypto = require('crypto');
var utils = require('../routes/common/utils');
var db = require('../model/db');

//create default user in the database
var clear_password = "password";
var hashed_password = Crypto.createHash('sha256').update(clear_password).digest("hex");

var admin_user = db.User({
    us_user_first_name: "ADMIN",
    us_user_last_name: "USER",
    us_password: hashed_password,
    us_email_address: "admin@local.local",
    us_username: "administrator",
    us_state: utils.USER_ACTIVE,
    us_user_role: utils.ADMIN,
    us_activation_token: "notrealtoken"
});

db.User.find().exec(function(err, alldocs) {
    console.log(alldocs);
})

admin_user.save(function(err, result) {
    if(err) {
        console.log("Error Thrown: ");
        console.error(err);
        process.exit(1);
    } else {
        console.log("Successfully created user.");

        console.log("#####################################");
        console.log("Username is: " + admin_user.us_email_address);
        console.log("Password is: " + clear_password);
        console.log("hash: " + hashed_password);
        console.log("#####################################");

        console.log("Note the us_email_address and us_password");
        process.exit(0);
    }
});

