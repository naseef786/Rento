var express = require('express');
var router = express.Router();

const {
      userLogin,
      aboutPage,
      contactPage,
      homePage,
      profilePage,
      wishlistPage,
      cartPage,
      checkoutPage,
      faqPage,
      viewProducts,
      userSignup,
      postSignin
} = require("../controller/user");


router.post('/signup',userSignup)
router.get('/',homePage);
router.get('/login',userLogin);
router.post("/login",postSignin)
router.get('/about',aboutPage);
router.get('/contact',contactPage);

router.get('/profile',profilePage);
router.get('/Wishlist',wishlistPage);
router.get('/Cart',cartPage);
router.get('/checkout',checkoutPage)
router.get('/faq',faqPage)
router.get('/products',viewProducts)


module.exports = router;
