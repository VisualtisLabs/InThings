'use strict'; 

var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    host: 'HOST',
    secure:false,
    tls: {rejectUnauthorized: false},
    port: 587,
    auth: {
        user: 'MAIL',
        pass: 'PASS'
    },
    debug:true
});

exports.sendMail = function(to, subject, text, callback) {	
    sendMail(to, subject, text, callback);
};

exports.sendMailToAdmin = function(subject, text, callback) {
    sendMail('ADMIN_EMAIL', subject, text, callback);
};

function defaultMailParams() {
    return {'from': 'FROM_EMAIL'}
}

function sendMail(to, subject, text, callback) {
    var data = defaultMailParams();
    data.to = to;
    data.subject = subject;
    data.text = text;
    transporter.sendMail(data);
    callback(null);
}
