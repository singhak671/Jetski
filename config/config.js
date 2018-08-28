var current_env  = "development";

function config_function(){
    var config = {};    
    switch (current_env) {
      case 'production':
        config = require('./env/production.json');
        break;
  
      case 'development':
        config = require('./env/development.json');
        break;
  
      case 'staging':
        config = require('./env/staging.json');
        break;
  
      default:
        console.error('NODE_ENV environment variable not set');
        process.exit(1);
    }
    return config; 
}

module.exports = config_function;






// https://drive.google.com/file/d/1EUsVU8pOB8Z_LTc9kmjS7TZLG8Rpc5Xw/view
// https://www.flinto.com/p/2651545d


// 1.API for view event management
// 2.API for feedback for particular
// 3.Admin panel UI integration modify
// 1. API for getting All event
// 2. API for cancelBooking
// 3.Modification on UI & functionality at event management at admin panel ﻿
// Publishable key
// pk_test_NkhYVArGE07qHgai7PuO6Bbm
// —	Aug 20, 2018	

// Secret key
// sk_test_4Sht4ZSKz8eUDCaiXP5pGfs6


