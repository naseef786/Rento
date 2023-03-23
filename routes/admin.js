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
  adminViewUsers,
  adminLogout,
  addCategory,
  adminViewCategory,
  deleteProduct,
  listProducts,
  deleteCategory,
  editProduct,
  editCategory,
  updateCategory,
  updateProduct

  
  
  
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
router.get('/productedit/:id',editProduct)

router.get('/adminviewcategories',adminViewCategory)
router.get('/delete/:id',deleteProduct)
router.get('/deleteCat/:id',deleteCategory)
router.get('/editcat/:id',editCategory)
router.get('/viewproductsC/:id',listProducts)
router.post('/updatecategory/:id',multer.single("image"),updateCategory)
router.post('/updateproduct/:id',multer.single("image"),updateProduct)


module.exports = router;
