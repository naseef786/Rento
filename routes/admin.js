var express = require('express');
var router = express.Router();
const multer = require('../middlewares/multer')
const { ifAdmin,ifAdminLogout } = require('../middlewares/sessionHandle')

const {
  adminLogin,
  adminViewProduct,
  adminlog,
  adminSignup,
  adminHome,
  adminAddProduct,
  viewAddProduct,
  adminViewUsers,
  adminLogout,
  addCategory,
  adminViewCategory

  
  
  
} = require("../controller/admin")





router.get('/',ifAdmin,adminHome)
router.get('/adminlogin',ifAdminLogout,adminlog)
router.post('/adminlogin',adminLogin)
router.post('/adminsignup',adminSignup)
router.get('/adminviewproducts',adminViewProduct)
router.post('/addproduct',multer.single("image"),adminAddProduct)
router.post('/addcategory',multer.single("image"),addCategory)
router.get('/admin',ifAdmin,adminViewProduct)
router.get('/adminviewusers',adminViewUsers)
router.post('/logout',adminLogout)


router.get('/adminviewcategory',adminViewCategory)


module.exports = router;
