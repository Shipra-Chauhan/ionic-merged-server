var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');
var SuperLogin = require('superlogin');

// // 2nd server for botel hotel users from mobile hotelapp 


var hotelapp = express();
hotelapp.set('port', process.env.PORT || 3001);
hotelapp.use(logger('dev'));
hotelapp.use(bodyParser.json());
hotelapp.use(bodyParser.urlencoded({ extended: false }));
hotelapp.use(cors());

hotelapp.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

var hotelConfig = {
  dbServer: {
    protocol: 'http://',
    host: 'localhost:5984',
    user: 'shiv467',
    password: 'shiv467',
    userDB: 'botel-hotel-users',
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
      shared: ['botelhoteluser','botelhotels']
    },
    model: {
      botelhoteluser: {
        permissions: ['_reader', '_writer', '_replicator']
      }
    }
  },
  providers: { 
    local: true 
  }
}

// Initialize SuperLogin 
var hotelSuperlogin = new SuperLogin(hotelConfig);

// Mount SuperLogin's routes to our hotelapp 
hotelapp.use('/auth', hotelSuperlogin.router);

hotelapp.listen(hotelapp.get('port'));
console.log("hotelapp listening on " + hotelapp.get('port'));
