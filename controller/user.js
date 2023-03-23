
const db = require("../config/server")
const { Users } = require("../model/user_Schema")
const { Category } = require("../model/category_Schema")
const { Products } = require('../model/product_Shema')
const bcrypt = require('bcrypt')




const userLogin = (req,res)=>{
    
    res.render("userLogin",{layout:"partials/loginlayout"})
}



const userSignup = async(req, res, next)=>{
       try{
        console.log(req.body);
        const user = new Users({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mobile,
            password:req.body.password
        });
        user.save().then(result=>{
            console.log(result);
            res.redirect('/login');
        })
       }
       catch(err){
         next(err);
        }
     }
   



const postSignin = async(req, res) => {
    try{
    console.log(req.body);
    let Email = req.body.email;
    let PASS = req.body.password;
    const user = await Users.findOne({ email: Email})
    if(!user){
        console.log('invalid Email');
        res.redirect('/login')}
    if (user){
        console.log(user);
        let data = await bcrypt.compare(PASS, user.password);
        console.log(data);
        if (data) {
            req.session.userLogged = true;
            req.session.user_id = user._id
            res.redirect('/');
        }
        else {

            res.redirect('/login')
        }
    }
}
     catch {
        res.status(500).send()
    }
}
const homePage = async(req,res)=>{
    try{
     
    await Products.find().then((items)=>{console.log(items);
    if(items) {
         Category.find().limit(3).then((categories)=>{console.log(categories)
   res.render("userHome",{items,categories:categories,layout:"partials/mainlayout"})
} )} })
}catch{
    res.status(500).send()
}}

const productDetails = async(req,res)=>{
    console.log(req.params);
    let id =req.params.id;
    await Products.findOne({_id:id}).then(data=>res.render('product',{data,layout:"partials/mainlayout"}))
    
}

   const getCategory = async (req,res)=>{
   
        try{
           
            let id = req.params.id;
           
            console.log(id);
            const items = await Products.find({category:id})
            console.log(items)
            res.render("viewProducts",{items,layout:'/partials/mainlayout'}); 
          
        }
        catch(err){
          console.log(err);
        }
      }


const contactPage = (req,res)=>{
    res.render("contact",{layout:"partials/mainlayout"})
}
const aboutPage = (req,res)=>{
    res.render("about",{layout:"partials/mainlayout"})
}

const profilePage =  async (req,res) => {
    const user_id = req.session.user_id;
    try{
    await Users.findById(user_id).then(data=>{
        res.render("userProfile",{data,layout:"partials/mainlayout"})
    })}
    catch(err){
        console.log(err);
    }
    
}


let getsearch = async(req,res)=>{
    const query = req.query.name;
    console.log(query);

    let regExp = new RegExp(`${query}`,'i')
let product = await Products.findOne({ name: { $regex: regExp } });
  if(product){
        await Products.findOne({ name: { $regex: regExp } })
        .then(cat=>{
            console.log(cat);
    
        res.render('searchPage',{cat,layout:"partials/mainlayout"});})
    }
    else if(!product){
        await Category.find({ name: { $regex:regExp } })
        .then(data=>{
            console.log(data);
    
        res.render('searchPage',{data,layout:"partials/mainlayout"});})

    }

    else{
        res.send('tools not found')
    }
       
    
}



const cartPage = async(req,res)=>{
     // retrieve the wishlist array from the userSchema for the current user
     const currentUser = await Users.findById(req.session.user_id).populate('cart');
     const cartProducts = currentUser.cart;
   
     // fetch the product details for each product id in the wishlist array
     const Cart = [];
     for (let i = 0; i < cartProducts.length; i++) {
       const product = await Products.findById(cartProducts[i].product);
       Cart.push(product);
     }
     console.log(Cart);
   
     // pass the array of product details to the wishlist.hbs page
     res.render("userCart",{layout:"partials/mainlayout",Cart})
   };


const addToCart =  async (req, res) => {
    const productId= req.params.id;
    
  console.log(req.params);
    try {
      const user_id = req.session.user_id;
      if (!user_id) {
        // If the user is not logged in, return an error
        return res.status(401).send('Unauthorized');
      }

         const productExist = await Products.findOne({_id:productId})
         console.log(productExist);
      // Create a new cart item
      let price = productExist.price
      let quantity= productExist.countInStock
      let product = productExist.id
if(productExist){
    let object={
        product:product,
        quantity:quantity,
        price:price
    }
    let isproductexist = await Users.findOne({_id:user_id,"cart.product":product})
    if(!isproductexist){
   
     let updateCart = await Users.updateOne({_id:user_id},{$push:{cart:object}}).then(result=>console.log(result));
     console.log(updateCart)
    
      if (!req.session.cart) {
        req.session.cart = [];
      }
      req.session.cart.push({price:price,quantity:quantity,product:product});
      req.session.cartCount = (req.session.cartCount || 0) + 1;
      console.log(req.session.cart);
      res.status(200).send(req.session.cart);}
      else{
        // let item = await Users.findOne({user:user_id,"caart.product":product},{"cart": 1,_id:0})
        // let productData= item.items.filter(val=>val.product==product)
        //  let actualQuantity = +productData[0].quantity+ +quantity
        //  if(actualQuantity<=product.quantity){
          
        // let cartUpdate =await Users.updateOne({user:user_id,"items.product":product},{$inc:{"items.$.quantity": quantity,"items.$.totalPrice":price}})
        // .then(val=>{
        //     console.log(val);
        //   res.send({msg_addToCartSuccess:true})
        // })
        res.send('product already added to cart')
      }
    }}
 catch (err){console.log(err);}
}

   const cartDelete = (req, res, next) => {
    try {
        let userId = req.session.user_id
        Users.findByIdAndUpdate(userId, { $pull: { cart: { product: req.params.id } } }).then(() => {
        
         res.redirect('/Cart')
        })
    } catch (error) {
        next(error)
    }
}
   
      
   

const checkoutPage = (req,res)=>{
    res.render("userCheckout",{layout:"partials/mainlayout"})
}
const faqPage = (req,res)=>{
    res.render("faq",{layout:"partials/mainlayout"})
}
const viewProducts = (req,res)=>{
    res.render("product",{layout:"partials/mainlayout"})
}
const wishlistCount =  async (req, res) => {
    const user_id = req.session.user_id;
    console.log(user_id);
    try {
     const user = await Users.findById(user_id)
      const product = await Products.findById(req.params.id);
    
      if (product.wishList.includes({user_id:user_id})) {
        return res.status(400).json({ msg: 'User already liked this product' });
      }
      product.wishList.push(user_id);
      product.likeCount++;
      user.wishList.push(product.id)
      await product.save();
      await user.save();
      res.json(product,user);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  };

const deleteWishlist = async(req, res, next) => {
    try {
        let id = req.params.id ;
        let userId = req.session.user_id
         await Users.findByIdAndUpdate(userId, { $pull: { wishList: { productId : id} } }).then(() => {
            res.json()
        }).catch(error => res.json({ response: "Something went wrong" }))
    } catch (error) {
        next(error)
    }
}


// route handler for the wishlist page
const wish = async (req, res) => {
    // retrieve the wishlist array from the userSchema for the current user
    const currentUser = await Users.findById(req.session.user_id).populate('wishList');
    const wishlistProducts = currentUser.wishList;
  
    // fetch the product details for each product id in the wishlist array
    const products = [];
    for (let i = 0; i < wishlistProducts.length; i++) {
      const product = await Products.findById(wishlistProducts[i]._id);
      products.push(product);
    }
    console.log(products);
  
    // pass the array of product details to the wishlist.hbs page
    res.render('userWishlist', { products ,layout:"partials/mainlayout" });
  };
  

  const postWishlist = async (req,res)=>{
    try {
        let userId = req.session.user_id
        let wishlist = await Users.findOne({ _id: userId, 'wishList.productId': req.body.id })
            .catch((error) => res.json({ response: error.message }))
        if (wishlist) res.json({ response: "The Product is already in your wishlist" })
        else {
          await Users.findByIdAndUpdate(userId, { $push: { wishList: { productId: req.params.id } } })
                .then(() => res.json({ response: false }) )
                .catch((error) => res.json({ response: "Something went wrong" }))
        }
    } catch (error) {
        next(error)
    }
}
const userLogout = (req,res)=>{
    req.session.destroy(err=>{
        if(err)throw err;
        res.redirect('/login')
    })
}



module.exports = {
    userLogin,
    contactPage,
    aboutPage,
    homePage,
    profilePage,
    // wishlistPage,
    wishlistCount,
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
    postWishlist,
    deleteWishlist,
    wish,
    cartDelete


}