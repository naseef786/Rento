
const db = require("../config/server")
const { users } = require("../model/user_Schema")
const bcrypt = require('bcrypt')




const userLogin = (req,res)=>{
    res.render("userLogin")
}


// const userSignup = async(req, res, next)=>{
//     try{
       
//    const {name,email,mobile,password} = req.body;
//    console.log(req.body);
//     await users.create( { name,email ,mobile, password }).then((result)=>{
        
//     console.log(result);
//   })
//   }
//  catch(err){
// next(err);
// }
// }
const userSignup = async(req, res, next)=>{
       try{
        console.log(req.body);
        const user = new users({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mobile,
            password:req.body.password
        });
        user.save().then(result=>{
            console.log(result);
            res.redirect('/');
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
    const user = await users.findOne({ email: Email})
    if (user){
        console.log(user);
        let data = await bcrypt.compare(PASS, user.password);
        console.log(data);
        if (data) {
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














const homePage = (req,res)=>{
    res.render("userHome")
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
    postSignin
}