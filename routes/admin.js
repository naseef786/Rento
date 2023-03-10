var express = require('express');
var router = express.Router();



const {
  adminLogin,
  adminViewProduct
  
} = require("../controller/admin")






router.get('/',adminLogin)
router.get('/admin',adminViewProduct)



module.exports = router;
