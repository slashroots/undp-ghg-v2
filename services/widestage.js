var request = require('request');
var CryptoJS = require("crypto-js");

var credentials = {};
if(process.env.WIDESTAGE) {
    var conn = process.env.WIDESTAGE.split('::');
    if(conn.length == 3) {
        credentials.domain = conn[0];
        credentials.username = conn[1];
        credentials.password = conn[2];
        console.log(credentials);
    }
}

function auth(cb) {
    request.post({'url': credentials.domain+'/api/login', 'json': {"userName": "administrator","password": "widestage",
        "remember_me": false}}, function (error, response, body) {
            cb(response.headers['set-cookie'].join(';'));
    });
}

exports.getReports = function(scb, ecb) {
    var params = {"page":1,"fields":["reportName","reportType","isPublic","owner","reportDescription"]};
    auth(function(cookies) {
        var url = credentials.domain + '/api/reports/find-all?data=' +
            encodeURIComponent(CryptoJS.AES.encrypt(String(JSON.stringify(params)), "SecretPassphrase"));
        request.get({'url': url, 'json': true, 'headers': {'Cookie': cookies}}, function(error, response, body) {
            if(error) {
                ecb(error)
                return;
            }

            var r = JSON.parse(body.split(',')[1]);
            scb((CryptoJS.AES.decrypt(r.data, 'SecretPassphrase').toString(CryptoJS.enc.Utf8)));
        })
    });
}

exports.getReport = function(id, scb, ecb) {
    request.post({'url': credentials.domain+'/api/login',
        'json': {"userName": credentials.username, "password": credentials.password,"remember_me": false}},
            function (error, response, body) {
                scb(response.headers['set-cookie']);
    });
}