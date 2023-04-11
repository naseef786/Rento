
const db = require("../config/server")
const { Users } = require("../model/user_Schema")
const { Category } = require("../model/category_Schema")
const { Products } = require('../model/product_Shema')
const bcrypt = require('bcrypt')
const { Coupon } = require("../model/coupon_Schema")
const { Order } = require('../model/order_Schema')
const mongoose = require("mongoose")
const { sum } = require("lodash")
const Razorpay = require('razorpay')
const { v4: uuidv4 } = require('uuid');
var instance = new Razorpay({
    key_id: "rzp_test_xKJur4lyLcX0ZO",
    key_secret: 'A5cyQ9fodN27Gwpgx5UlbmX0',
})
const crypto = require('crypto');


const userLogin = (req, res) => {

    res.render("userLogin", { layout: "partials/loginlayout" })
}

const userSignup = async (req, res, next) => {
    try {
        console.log(req.body);
        const user = new Users({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            password: req.body.password
        });
        user.save().then(result => {
            console.log(result);
            res.redirect('/login');
        })
    }
    catch (err) {
        next(err);
    }
}

const postSignin = async (req, res) => {
    try {
        console.log(req.body);
        let Email = req.body.email;
        let PASS = req.body.password;
        const user = await Users.findOne({ email: Email })
        if (!user) {
            console.log('invalid Email');
            res.redirect('/login')
        }
        if (user) {
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
const homePage = async (req, res) => {
    try {



        let item = await Products.find().sort({ dateCreated: -1 })
        let items = await Products.find()
        let categories = await Category.find()
        let user = await Users.findById(req.session.user_id)
        req.session.user = user
        console.log(req.session);
        res.render("userHome", { items, item, user, categories: categories, layout: "partials/mainlayout" })


    }




    catch {
        res.status(500).send()
    }
}

const productDetails = async (req, res) => {
    try {
        console.log(req.params);
        let id = req.params.id;
        await Products.findOne({ _id: id }).then(data => res.render('product', { data, layout: "partials/mainlayout" }))
    }
    catch (err) {
        console.log(err);
    }
}

const getCategory = async (req, res) => {

    try {

        let id = req.params.id;

        console.log(id);
        const items = await Products.find({ category: id })
        const category = await Category.findById(id)
        console.log(items)
        res.render("viewProducts", { items, layout: '/partials/mainlayout', category });

    }
    catch (err) {
        console.log(err);
    }
}

const contactPage = (req, res) => {
    res.render("contact", { layout: "partials/mainlayout" })
}
const aboutPage = (req, res) => {
    res.render("about", { layout: "partials/mainlayout" })
}

const profilePage = async (req, res) => {
    const user_id = req.session.user_id;
    try {
        await Users.findById(user_id).then(data => {
            res.render("userProfile", { data, layout: "partials/mainlayout" })
        })
    }
    catch (err) {
        console.log(err);
    }

}

const UpdateProfile = async (req, res) => {
    try {
        const Id = req.session.user_id
        const name = req.body.name
        const email = req.body.email
        const mobile = req.body.mobile
        const password = req.body.password

        const updateUser = await Users.findByIdAndUpdate({ _id: Id }, { $set: { name: name, email: email, mobile: mobile, password: password } })

        if (updateUser) {

            res.redirect("/profile")
        }

    } catch (error) {
        console.log(error.message);
    }
}

let getsearch = async (req, res) => {
    const query = req.query.name;
    console.log(query);

    let regExp = new RegExp(`${query}`, 'i')
    let product = await Products.findOne({ name: { $regex: regExp } });
    
    if (product) {
        await Products.findOne({ name: { $regex: regExp } })
            .then(cat => {
                console.log(cat);

                res.render('searchPage', { cat, layout: "partials/mainlayout" });
            })
    }
    else if (!product) {
        await Category.find({ name: { $regex: regExp } })
            .then(data => {
                console.log(data);

                res.render('searchPage', { data, layout: "partials/mainlayout" });
            })

    }

    else {
        res.send('tools not found')
    }


}

const cartPage = async (req, res) => {
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
    res.render("userCart", { layout: "partials/mainlayout", Cart, coupdata, cartProducts })
};

const addToCart = async (req, res) => {
    const productId = req.params.id;

    console.log(req.params);
    try {
        const user_id = req.session.user_id;
        if (!user_id) {
            // If the user is not logged in, return an error
            return res.status(401).send('Unauthorized');
        }

        const productExist = await Products.findOne({ _id: productId })
        console.log(productExist);
        // Create a new cart item
        let product = productExist.id
        let price = productExist.price
        let name = productExist.name;
        let quantity = req.body.quantity;
        let daysOfRent = req.body.daysofrent;
        if (productExist) {
            let object = {
                product: product,
                price: price,
                quantity: quantity,
                daysOfRent: daysOfRent,
                productName: name,
                total: price * quantity * daysOfRent
            }
            let isproductexist = await Users.findOne({ _id: user_id, "cart.product": product })
            if (!isproductexist) {


                let updateCart = await Users.updateOne({ _id: user_id }, { $push: { cart: object } }).then(result => console.log(result));
                console.log(updateCart)

                if (!req.session.cart) {
                    req.session.cart = [];
                }
                req.session.cart.push({ price: price, quantity: quantity, product: product });
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
            else {
                res.redirect('/Cart')
            }
        }
    }
    catch (err) { console.log(err); }

}

const cartUpdate = async (req, res, next) => {
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

const faqPage = (req, res) => {
    res.render("faq", { layout: "partials/mainlayout" })
}

const viewProducts = async (req, res) => {
    await Products.find().then(data => {
        res.render("wholeProducts", { layout: "partials/mainlayout", data })
    })

}




const wishlistCount = async (req, res) => {
    console.log(req.body);
    const itemID = req.body.itemID;
    const userID = req.session.user_id; // In this example we will hardcode the userID
    let user = await Users.findById(userID)
    let product = await Products.findById(itemID)
    if (!user) {
        // User not found
        return res.status(404).send();
    }
    const index = user.wishList.indexOf(itemID);
    const wish = product.wishList.indexOf(userID);
    if (index === -1 || wish === -1) {
       
        user.wishList.push(itemID);
        product.wishList.push(userID);
        await user.save();
        await product.save();
        res.status(200).send({ message: 'Product added to wishlist.' });
    } else {
        user.wishList.splice(index, 1);
        product.wishList.splice(wish,1)
        await user.save();
        await product.save();
        res.status(200).send({ message: 'Product removed from wishlist.' });
    }
   
}
    ;



const deleteWishlist = async (req, res, next) => {
    try {
        let userId = req.session.user_id
        await Users.findByIdAndUpdate(userId, { $pull: { wishList: req.params.id } }).then(() => {

            res.redirect('/wishlist')
        })

    }


    catch (error) {
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
        const product = await Products.findById(wishlistProducts[i]);
        products.push(product);
    }
    console.log(products);

    // pass the array of product details to the wishlist.hbs page
    res.render('userWishlist', { products, layout: "partials/mainlayout" });
};



const userLogout = (req, res) => {
    req.session.destroy(err => {
        if (err) throw err;
        res.redirect('/login')
    })
}

const placeorder = async (req, res) => {

    console.log(req.body);
    let user_id = req.session.user_id
    const delivery = {
        city: req.body.city,
        country: req.body.country,
        state: req.body.state,
        pin: req.body.pincode,
        Address: req.body.address
    }
    const AddressObj = {
        city: req.body.city,
        country: req.body.country,
        phone: req.body.phone,
        state: req.body.state,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        pincode: req.body.pincode,
        Address: req.body.address,
    }
    try {
        let userad = await Users.findById(user_id)
        userad.address.push(AddressObj)
        userad.save().then(data => console.log(data))
        let coupon = req.body.couponcode;
        const randomstring = uuidv4().slice(0, 5);
        console.log(randomstring, "random string");

        let coup = await Coupon.findOneAndUpdate({ coupenCode: coupon })
        coup.users.push(user_id)
        coup.quantity--
        coup.save();
        const user = await Users.findOne({ _id: user_id })
        let Cart = user.cart
        let items = []
        items.push(Cart)
        console.log(items);
    
        const totalPrice = user.cart.reduce((total, item) => {
            return total + item.total
        }, 0);
        const grandTotal = (coup.percentDiscount * totalPrice) / 100
        const discount = totalPrice - grandTotal;

        
        let order = new Order({
            products: items,
            Address: AddressObj,
            status: req.body.status,
            userId: user_id,
            deliveryAddress: delivery,
            couponCode: coup.couponCode,
            payment: req.body.payment,
            subTotalPrice: totalPrice,
            discountPrice: discount,
            totalPrice: grandTotal,

        })
        order = order.save().then(async (data) => {
            const orderId = data._id.toString()
            console.log(orderId);
            req.session.orderdata = data;
            if (data.payment == 'COD') {
                await Users.updateOne({ _id: user_id }, { $set: { cart: [] } })
                console.log(data);
                // res.json({ status: true })
                res.render('orderSucccess', {
                    data,
                    layout: "partials/mainlayout"
                })
            }
            else {
             
                let amount = totalPrice
                req.session.amount = totalPrice*100
                const response = await instance.orders.create({
                    amount: amount * 100,
                    currency: "INR",
                    receipt: orderId,

                })
                console.log(response);
                res.render('checkoutform', {
                    key_id: instance.key_id,
                    orderId: response.id,
                    amount: amount,
                    name: user.name,
                    email: user.email,
                    contactNumber: user.mobile,
                    response: response,
                    layout: "partials/mainlayout"
                });
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }


}


let orderSuccess = async (req, res,next) => {
    console.log(req.body,);
    const amount = req.session.amount;
    const order_id = req.body.order_id;
    const payment_id = req.body.payment_id;
    const signature = req.body.signature;
    let user_id = req.body.user_id;
 
    try {
const message = order_id + '|' + payment_id;
const generated_signature = crypto.createHmac('sha256', instance.key_secret)
    .update(message)
    .digest('hex');
if (generated_signature === signature) {
    console.log(req.session);
    const orderid = req.session.orderdata._id
   let order = await Order.findOneAndUpdate({ _id: orderid }, {
        $set: {
            paymentStatus: "Completed",
        },
    })
    order.save();
    let user = await Users.findOneAndUpdate({_id:user_id})
       
        await Products.find().then(async productsIn => {
          
        for (let i = 0; i < user.cart.length; i++) {
            for (let j = 0; j < productsIn.length; j++) {
                if (user.cart[i].product == productsIn[j]._id) {
                    const pdtq = productsIn[j].countInStock - user.cart[i].quantity
                    console.log(pdtq);
                      await  Products.findOneAndUpdate({ _id: productsIn[j]._id }, { $set: { countInStock: pdtq } })
                  
                }
               
            }
        }
    })
    
           user.set({cart:[]})
           user.orders.push(order._id) 
           user.save()
        
    res.json({
        payment: true,
        orderid: req.session.orderdata._id,
    })
} else {
    res.json({
        payment: false,
        orderid: req.session.orderid
    })
}
} catch (error) {
console.log(error.message)
next(error)
}
}









const orderSuccessVerified = async (req, res) => {
    let id = req.params.id
    let order = await Order.findById(id).populate('products.Object').exec()
    console.log(order);

    console.log(order);
    // const orderedProducts = order.products;
    // const products = order.products.map((product) => {
    //     return {
    //       name: product.productName,
    //     };
    //   });
  
     res.render('orderSucccess', {
         order,
         layout: "partials/mainlayout"
     })
 
 }
 




const checkoutPage = async (req, res) => {
    let coupon = req.body.couponcode;
    let totalPrice = req.body.totalPrice;
    let user_id = req.session.user_id


    let couponData = await Coupon.findOne({ couponCode: coupon })
    const user = await Users.findOne({ _id: user_id })
    const address = user.address[0];
    const grandTotal = (couponData.percentDiscount * totalPrice) / 100;
    await Coupon.find().then(coupons => {
        res.render("userCheckout", { layout: "partials/mainlayout", couponData, grandTotal, cartDetails: user.cart, coupons, totalPrice, address })
    })

}


const deleteOrder = async (req, res) => {
    Order.findByIdAndRemove(req.params.id).then(async order => {
        if (order) {
          
                await Order.findByIdAndRemove(req.params.id)
        
            res.redirect('/getOrder')
            // return res.status(200).json({ success: true, message: 'the order is deleted!' })
        } else {
            return res.status(404).json({ success: false, message: "order not found!" })
        }
    }).catch(err => {
        return res.status(500).json({ success: false, error: err })
    })
}
const getOrderCount = async (req, res) => {
    const orderCount = await Order.countDocuments((count) => count)

    if (!orderCount) {
        res.status(500).json({ success: false })
    }
    res.send({
        orderCount: orderCount
    });
}

const getOrders = async (req, res) => {
    let userId = req.session.user_id
    let user = await Users.findOne({_id:userId})
   
    let order = await Order.findById(user.orders).populate('products.Object').exec()
    console.log(order);
  
    res.render("orderPage",{ layout: "partials/mainlayout" , order,user:user});
}




const checkoutaddAddress = async (req, res) => {
    try {

        console.log("inside checkout address");
        if (req.session.user_id) {
            Id = req.session.user_id;
            console.log(Id, "idd");
            const AddressObj = {
                city: req.body.city,
                county: req.body.country,
                phone: req.body.phone,
                state: req.body.state,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                pincode: req.body.pincode,
                Address: req.body.address
            }
            const userAddress = await Users.findOneAndUpdate({ userId: Id })
            userAddress.address.push(AddressObj)
            await userAddress.save().then(() => {
                res.redirect('/checkout')
            })
        }

    }
    catch (error) {
        console.log(error.message);
    }
}











module.exports = {
    userLogin,
    contactPage,
    aboutPage,
    homePage,
    profilePage,
    UpdateProfile,
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
    deleteWishlist,
    wish,
    cartDelete,
    cartUpdate,
    placeorder,
    getOrderCount,
    getOrders,
    deleteOrder,
    checkoutaddAddress,
    orderSuccess,
    orderSuccessVerified





}