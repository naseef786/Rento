
const db = require("../config/server")
const { Users } = require("../model/user_Schema")
const { Category } = require("../model/category_Schema")
const { Products } = require('../model/product_Shema')
const bcrypt = require('bcrypt')
const { Coupon } = require("../model/coupon_Schema")
const { Order } = require('../model/order_Schema')
const { OrderItem } = require('../model/orderItemSchema')
const mongoose =require("mongoose")
const { sum } = require("lodash")




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
            req.session.user_id = user._id;
            req.session.cart = user.cart;
            req.session.name = user.name;
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
           Category.find().then((categories)=>{console.log(categories);
            if(categories){
             Users.findById(req.session.user_id).then(user=> {console.log(user);
                res.render("userHome",{items,user,categories:categories,layout:"partials/mainlayout"})
                                                                     })
       
                          }})}})
  
}
catch{
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
     // retrieve the caart array from the userSchema for the current user
     const currentUser = await Users.findById(req.session.user_id).populate('cart');
     console.log(req.session);
     const cartProducts = currentUser.cart;
   
     // fetch the product details for each product id in the CArtarray
     const Cart = [];
     for (let i = 0; i < cartProducts.length; i++) {
       const product = await Products.findById(cartProducts[i].product);

       Cart.push(product);
       
     }
     console.log(Cart);
    

      let coupdata = await Coupon.find()


     // pass the array of product details to the wishlist.hbs page
     res.render("userCart",{layout:"partials/mainlayout",Cart,coupdata,cartProducts})
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
      let product = productExist.id
      let price = productExist.price
      let name = productExist.name;
      let quantity = req.body.quantity;
      let daysOfRent = req.body.daysofrent;
    if(productExist){
    let object={
        product:product,
        price:price,
        quantity:quantity,
        daysOfRent:daysOfRent,
        productName:name,
        total:price*quantity*daysOfRent
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
      res.redirect('/Cart')
    }
   
    //   else if(productExist){
    //     let user = await Users.findOne({user:user_id,"cart.product":product},{"cart": 1,_id:0})
    //      let productData= user.cart.filter(val=>val.product==product)
    //     let actualQuantity = +productData[0].quantity+ +quantity
    //      if(actualQuantity<=product.quantity){
          
    //     let cartUpdate =await Users.updateOne({user:user_id,"cart.product":product},{$inc:{"items.$.quantity": quantity,"items.$.totalPrice":price}})
    //     .then(val=>{
    //     console.log(val);
    //     res.redirect('/')
    //      })
       
    // }}
   
    // else if (isproductexist){
    //     let cart = isproductexist.cart
    //         cart.quantity++;
    //         cart.price = cart.quantity * cart.price;
          
    // }
    else{
        res.redirect('/Cart')
    }
}
    }
 catch (err){console.log(err);}

}

const cartUpdate = async(req, res, next) => {
    try {
        let userId = req.session.user_id
         await Products.findById(req.params.id, { quantity: 1, _id: -1, shopPrice: 1 }).then(product => {
            let { quantity } = product
            let count = req.body.count
            let price = product.price;
            let totalsing = price * count
            if (count <= quantity) {
                Users.updateOne({ _id: userId, 'cart._id': req.body.cartid }, { $set: { 'cart.$.quantity': count, 'cart.$.total': totalsing } }).then(() => {
                    subTotal(userId).then(async (total) => res.json({ response: true, total: total }))
                })
            }
            else {
                totalsing = price * quantity
                Users.updateOne({ _id: userId, 'cart._id': req.body.cartid }, { $set: { 'cart.$.quantity': quantity, 'cart.$.total': totalsing } }).then(() => {
                    res.json({ response: false })
                })

            }
        })
    } catch (error) {
        next(error)
    }
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
    
      if (!product.wishList.includes({user_id:user_id})) {
        let object = {productId : product.id}
      product.wishList.push(user_id);
      product.likeCount++;
      user.wishList.push(object)
      await product.save();
      await user.save();
      res.redirect('/');
      }
else{
    return res.status(400).json({ msg: 'you have already liked this product' });
}
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  };

const deleteWishlist = async(req, res, next) => {
    try {
   let userId = req.session.user_id
     await Users.findByIdAndUpdate(userId, { $pull: { wishList: {productId: req.params.id } } }).then(() => {
       
    res.redirect('/wishlist')
   })
    
    }

   
catch (error) {
    next(error)
}}

 const removeWish = async (req, res) => {
    const userId = req.session.user_id; // Assuming that the user is authenticated and their ID is stored in the req.user object
    const itemId = req.body.Id;
  
    await Users.findByIdAndUpdate(userId, {
        $pull: { wishList: itemId }
      });
    
      res.redirect('/wishlist');
    // user.wishList = user.wishList.filter( productId => productId  !== itemId); // Remove the item ID from the wishlist array
  };

// route handler for the wishlist page
const wish = async (req, res) => {
    // retrieve the wishlist array from the userSchema for the current user
    const currentUser = await Users.findById(req.session.user_id).populate('wishList');
    const wishlistProducts = currentUser.wishList;
  
    // fetch the product details for each product id in the wishlist array
    const products = [];
    for (let i = 0; i < wishlistProducts.length; i++) {
      const product = await Products.findById(wishlistProducts[i].productId);
      products.push(product);
    }
    console.log(products);
  
    // pass the array of product details to the wishlist.hbs page
    res.render('userWishlist', { products ,layout:"partials/mainlayout" });
  };
  

  const postWishlist = async (req,res)=>{
    try {
        let userId = req.session.user_id
        console.log(app.locals.session);
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

// const placeorder = async (req,res)=>{

//         try {
//           // Find the product by ID
//           const product = await Products.findById(req.body.productId);
//           if (!product) {
//             return res.status(404).json({ message: 'Product not found' });
//           }
//           let price = req.body.price;
//           let quantity = req.body.quantity;
//           let days = req.body.days;
//           // Create a new order for the product
//           const order = new Order({
//             customerName: req.body.userName,
//             product: {
//               name: product.name,
//               price: product.price,
//               image: product.image,
//             },
//             quntity:req.body.quntity,
//             days:req.body.days,
//             quantity: req.body.quantity,
//             total:price*days*quantity,
//           });
      
//           // Save the order to the database
//           const newOrder = await order.save();
//           res.status(201).json(newOrder);
//         } catch (err) {
//           res.status(400).json({ message: err.message });
//         }
//       };






  // const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) =>{
    //     let newOrderItem = new OrderItem({
    //         quantity: orderItem.quantity,
    //         product: orderItem.product,
    //         daysOfRent: orderItem.daysOfRent
            
    //     })

    //     newOrderItem = await newOrderItem.save();

    //     return newOrderItem._id;
    // }))
   // const orderItemsIdsResolved =  await orderItemsIds;
const placeorder = async (req,res)=>{

console.log(req.body);
     let coupon  =req.body.couponcode;
     let totalPrice = req.body.totalPrice;
    let user_id = req.session.user_id
     let couponData = await Coupon.findOne({couponCode:coupon})
    let discount = couponData.percentDiscount
    const grandTotal = (discount*totalPrice)/100;
    const user = await Users.findOne(user_id)
    let Cart = user.cart
    let order = new Order({
        orderItems: Cart,
        Address1: object,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: grandTotal,
        user: user_id,
    })
    order = await order.save();

    if(!order)
    return res.status(400).send('the order cannot be created!')

    res.send(order);
}


const checkoutPage = async (req,res)=>{
    let coupon  =req.body.couponcode;
    let totalPrice = req.body.totalPrice; 
    let user_id = req.session.user_id


    let couponData = await Coupon.findOne({couponCode:coupon})
    const user = await Users.findOne({_id:user_id})
      
   const grandTotal = (couponData.percentDiscount*totalPrice)/100;
      await Coupon.find().then(coupons=>{
    res.render("userCheckout",{layout:"partials/mainlayout",couponData,grandTotal,cartDetails:user.cart,coupons,totalPrice})
})
   
}


const deleteOrder = (req, res)=>{
    Order.findByIdAndRemove(req.params.id).then(async order =>{
        if(order) {
            await order.orderItems.map(async orderItem => {
                await OrderItem.findByIdAndRemove(orderItem)
            })
            return res.status(200).json({success: true, message: 'the order is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "order not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
}
const getOrderCount = async (req, res) =>{
    const orderCount = await Order.countDocuments((count) => count)

    if(!orderCount) {
        res.status(500).json({success: false})
    } 
    res.send({
        orderCount: orderCount
    });
}

const getOrders =async (req, res) =>{
    const userOrderList = await Order.find({user: req.params.userid}).populate({ 
        path: 'orderItems', populate: {
            path : 'product', populate: 'category'} 
        }).sort({'dateOrdered': -1});

    if(!userOrderList) {
        res.status(500).json({success: false})
    } 
    res.send(userOrderList);
}
const proceedOrder = (req,res)=>{
    console.log(req.body);
    res.render('check');
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
    cartDelete,
    cartUpdate,
    placeorder,
    removeWish,
    getOrderCount,
    getOrders,
    deleteOrder,
    proceedOrder,
  


}