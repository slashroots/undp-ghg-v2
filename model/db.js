/**
 * As a guiding principle - each table must have a state... this allows us to deactivate (but not delete!)
 * Created by matjames007 on 9/10/16.
 */

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var Schema = mongoose.Schema;

//mongoose.connect("mongodb://localhost:27017/undp-ghg");
mongoose.connect(process.env.MONGODB_URI);


/**
 * Users are capable of being tracked throughout the system.  Each user has an assigned role,
 * and state.  The state of a user changes based on the registration with the system and if
 * an administrator wants to deactivate the account.
 */
var UserSchema = new Schema({
    us_user_first_name: {type: String, required: true},
    us_user_last_name: {type: String, required: true},
    us_username: {type: String, unique: true, required: true},
    us_password: {type: String, required: true},
    us_email_address: {type: String, unique:true, required: true},
    us_contact: {type: String, required: true},
    us_user_creation_date: {type: Date, default: Date.now()},
    us_state: {type: String, default: 'pending'},
    us_address: {type: String, required: false},
    us_company: {type: String, required: false},
    us_intended_use: {type: String, required: false},
    us_user_role: {type: String, required: true},
    us_activation_token: {type: String, required: true}
});

exports.User = mongoose.model('User', UserSchema);
