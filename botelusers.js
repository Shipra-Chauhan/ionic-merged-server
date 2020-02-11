var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');
var SuperLogin = require('superlogin');

// Ist server for botel users from userapp 
var userapp = express();
userapp.set('port', process.env.PORT || 3000);
userapp.use(logger('dev'));
userapp.use(bodyParser.json());
userapp.use(bodyParser.urlencoded({ extended: false }));
userapp.use(cors());

userapp.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,DELETE, PUT');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var config = {
  dbServer: {
    protocol: 'http://',
    host: 'localhost:5984',
    user: 'shiv467',
    password: 'shiv467',
    userDB: 'botel-users',
    couchAuthDB: '_users'
  },
  mailer: {
    fromEmail: 'gmail.user@gmail.com',
    options: {
      service: 'Gmail',
      auth: {
        user: 'gmail.user@gmail.com',
        pass: 'userpass'
      }
    }
  },
  security: {
    maxFailedLogins: 3,
    lockoutTime: 600,
    tokenLife: 86400,
    loginOnRegistration: true,
  },
  userDBs: {
    defaultDBs: {
      private: ['boteluser'],
      shared: ['botelhotels']
    },
    model: {
      boteluser: {
        permissions: ['_reader', '_writer', '_replicator']
      }
    }
  },
  providers: {
    local: true
  }
}

//Initialize SuperLogin 
var userSuperlogin = new SuperLogin(config);

// Mount SuperLogin's routes to our userapp 
userapp.use('/auth', userSuperlogin.router);

userapp.listen(userapp.get('port'));
console.log("userapp listening on " + userapp.get('port'));

