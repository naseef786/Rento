var express = require('express');
var router = express.Router();
const multer = require('../middlewares/multer')
const { ifAdmin,ifAdminLogout, ifAdminAxios } = require('../middlewares/sessionHandle')

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
  updateProduct,
  postCreateCoupon,
  manageCoupons,
  adminViewWish,
  manageOrder,
  deleteCoupon,
  UpdateProfile

  
  
  
} = require("../controller/admin");
const { axios } = require('axios');





router.get('/',ifAdmin,adminHome)
router.get('/adminlogin',ifAdminLogout,adminlog)
router.post('/adminlogin',adminLogin)
router.post('/adminsignup',adminSignup)
router.get('/updateprofile',ifAdmin,UpdateProfile)



router.get('/admin',ifAdmin,adminViewProduct)
router.get('/adminviewusers',adminViewUsers)


router.get('/adminviewproducts',adminViewProduct)
router.post('/addproduct',multer.single("image"),adminAddProduct)
router.post('/updateproduct/:id',multer.single("image"),updateProduct)
router.get('/delete/:id',deleteProduct)
router.get('/productedit/:id',editProduct)

// router.delete('/deleteCat/:id',ifAdminAxios,deleteCategory)
router.post('/addcategory',ifAdmin,multer.single("image"),addCategory)
router.get('/adminviewcategories',ifAdmin,adminViewCategory)
router.get('/viewproductsC/:id',listProducts)
router.get("/deleteCat/:id",ifAdminAxios, deleteCategory)
router.get('/editcat/:id',editCategory)
router.post('/updatecategory/:id',multer.single("image"),updateCategory)


router.post('/addcoupon',postCreateCoupon)
router.get('/managecoupons',manageCoupons)
router.get('/deletecoupon/:id',deleteCoupon)

router.get('/viewwishlisted/:id',adminViewWish)

router.get('/getorder',manageOrder)

router.post('/logout',adminLogout)
module.exports = router;
