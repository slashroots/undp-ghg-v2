var request = require('request');
var CryptoJS = require("crypto-js");

var domain = "http://localhost"

function auth(cb) {
    request.post({'url': domain+'/api/login', 'json': {"userName": "administrator","password": "widestage","remember_me": false
                                                                    }}, function (error, response, body) {
        cb(response.headers['set-cookie'].join(';'));
    });
}

exports.getReports = function(scb, ecb) {
    var params = {"page":1,"fields":["reportName","reportType","isPublic","owner","reportDescription"]};
    auth(function(cookies) {
        var url = domain + '/api/reports/find-all?data=' +
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
    request.post({'url': domain+'/api/login', 'json': {"userName": "test","password": "test","remember_me": false
                                                                        }}, function (error, response, body) {
        scb(response.headers['set-cookie']);
    });
}