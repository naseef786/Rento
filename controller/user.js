
const db = require("../config/server")
const { Users } = require("../model/user_Schema")
const { Category } = require("../model/category_Schema")
const { Products } = require('../model/product_Shema')
const bcrypt = require('bcrypt')




const userLogin = (req,res)=>{
    
    res.render("userLogin")
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
            res.send('not allow')
        }
    }
}
     catch {
        res.status(500).send()
    }
}














const homePage = async(req,res)=>{
    try{
   await Products.find().then((items)=>{
    console.log(items);
    res.render("userHome",{items})
   })
}catch{
    res.status(500).send()
}
   
}
const contactPage = (req,res)=>{
    res.render("contact")
}
const aboutPage = (req,res)=>{
    res.render("about")
}

const profilePage = (req,res)=>{
    res.render("userProfile")
}
const wishlistPage = (req,res)=>{
    res.render("userWishlist")
}
const cartPage = (req,res)=>{
    res.render("userCart")
}
const checkoutPage = (req,res)=>{
    res.render("userCheckout")
}
const faqPage = (req,res)=>{
    res.render("faq")
}
const viewProducts = (req,res)=>{
    res.render("product")
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
    wishlistPage,
    cartPage,
    checkoutPage,
    faqPage,
    viewProducts,
    userSignup,
    postSignin,
    userLogout
}