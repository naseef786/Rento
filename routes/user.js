var express = require('express');
var router = express.Router();
const{ ifUser, ifUserLogout ,ifCart}= require('../middlewares/sessionHandle')
const {
      userLogin,
      aboutPage,
      contactPage,
      homePage,
      profilePage,
      // wishlistPage,
      cartPage,
      checkoutPage,
      faqPage,
      // viewProducts,
      userSignup,
      postSignin,
      userLogout,
      addToCart,
      getsearch,
      getCategory,
      productDetails,
      // postWishlist,
      wish,
      deleteWishlist,
      cartDelete,
      wishlistCount
} = require("../controller/user");

router.post('/addtocart/:id',ifUser,addToCart)
router.post('/signup',userSignup)
router.get('/',ifUser,homePage);
router.get('/login',ifUserLogout,userLogin);
router.post('/login',postSignin)
router.get('/about',aboutPage);
router.get('/contact',ifUser,contactPage);
router.get('/cart',ifUser,cartPage);
router.get('/search',getsearch)
router.get('/profile',profilePage);
router.get('/Wishlist',wish);
router.get('/Cart',cartPage);
router.get('/checkout',checkoutPage)
router.get('/faq',faqPage)
// router.get('/products',viewProducts)
router.post('/logout',userLogout)
router.get('/getcategory/:id',getCategory)
router.get('/productdetails/:id',productDetails)
router.post('/postwishlist/:id',wishlistCount)
router.post('/deletecart/:id',cartDelete)
router.post('/deletewish/:id',deleteWishlist)

module.exports = router;
