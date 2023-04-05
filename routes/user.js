var express = require('express');
var router = express.Router();
const{ ifUser, ifUserLogout ,ifCart, ifUserAxios,userCart}= require('../middlewares/sessionHandle')
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
      viewProducts,
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
      wishlistCount,
      placeorder,
      proceedOrder,
      // removeWish
      getOrderCount,
      getOrders,
      deleteOrder,
      UpdateProfile,
      checkoutaddAddress,
      orderSuccess,
     
} = require("../controller/user");

//login and sign in
router.post('/signup',userSignup)
router.get('/',ifUser,homePage);
router.get('/login',ifUserLogout,userLogin);
router.post('/login',postSignin)

//pages
router.get('/faq',faqPage)
router.get('/about',aboutPage);
router.get('/contact',ifUser,contactPage);


//search
router.get('/search',getsearch)

//views
router.get('/productdetails/:id',productDetails)
router.get('/viewallproducts',viewProducts)
router.get('/getcategory/:id',getCategory)
router.get('/profile',profilePage);
router.post('/updataprofile',UpdateProfile)

//wishlist
router.post('/wishlist/add',ifUser,wishlistCount)
router.get('/Wishlist',ifUser,wish);
router.post('/deletewish/:id',ifUser,deleteWishlist)
// router.patch('/removewish',ifUserAxios,removeWish)


//cart
router.post('/addtocart/:id',ifUser,addToCart)
router.get('/Cart',userCart,ifUser,cartPage);
router.post('/deletecart/:id',cartDelete)


//checkout
router.get('/checkout',userCart,checkoutPage)
router.post('/checkout',checkoutPage)
router.get('/proceedOrder',userCart,ifUser,placeorder)
// router.get('/placeOrder',proceedOrder)
router.post('/placeOrder',placeorder)
//logout
router.post('/logout',userLogout)
router.post('/success',orderSuccess)

module.exports = router;
