var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors');
var SuperLogin = require('superlogin');

// // 2nd server for botel hotel users from mobile genericapp 


var genericapp = express();
genericapp.set('port', process.env.PORT || 3002);
genericapp.use(logger('dev'));
genericapp.use(bodyParser.json());
genericapp.use(bodyParser.urlencoded({ extended: false }));
genericapp.use(cors());

genericapp.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

var genericConfig = {
  dbServer: {
    protocol: 'http://',
    host: 'localhost:5984',
    user: 'shiv467',
    password: 'shiv467',
    userDB: 'botel-hotels',
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
      shared: ['botelhotels']
    },
    model: {
      botelhotels : {
        permissions: ['_reader', '_writer', '_replicator']
      }
    }
  },
  providers: { 
    local: true 
  }
}

// Initialize SuperLogin 
var genericSuperlogin = new SuperLogin(genericConfig);

// Mount SuperLogin's routes to our genericapp 
genericapp.use('/auth', genericSuperlogin.router);

genericapp.listen(genericapp.get('port'));
console.log("genericapp listening on " + genericapp.get('port'));
