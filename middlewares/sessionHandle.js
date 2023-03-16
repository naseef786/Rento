const { users }=require("../model/user_Schema")
const ifAdmin= (req,res,next)=>{
    if(req.session.admin_id){
    next();
}
else{
    res.redirect("/admin/adminlogin")
}
}

const ifUser = (req,res,next)=>{
    if(req.session.user_id){
    next();
}
else{
    res.redirect("/login")
}
}
const ifUserLogout = async (req,res,next)=>{
    if(req.session.user_id){
       res.redirect('/')
    }
    next()
   }


// const ifAdminAxios= async(req,res,next)=>{
//     if(req.session.adminlogin){
//         next() 
//     }
//      else{
//         res.send({msg_login:true})
//      }   
//     }



// const ifUserAxios= async(req,res,next)=>{
//     if(req.session.loginuser){
//         if (await user.findOne({ _id: req.session.userId, status: true })){
//         next() 
//         }
//         else{
//             req.session.loginuser=false
//         }
// }
// else{
    
//     res.send({msg_login:true})
// }
// }

// const ifUser= async(req,res,next)=>{
//     if(req.session.loginuser){
//         if (await users.findOne({ _id: req.session.userId, status: true })){
//         next() 
//         }
//         else{
//             req.session.loginuser=false
//         }
// }
// else{
    
//     if(req.path=="/cart"){
//         req.session.loginTocart=true
        
//     }
//     else if(req.path=="/wishList"){
//         req.session.loginToWishList=true
//     }
//     res.redirect("/")
// }
// }
const ifAdminLogout = async (req,res,next)=>{
 if(req.session.admin_id){
    res.redirect('/admin')
 }
 next()
}
module.exports={ ifAdmin,ifUser,ifAdminLogout,ifUserLogout}
// ifUserAxios,ifAdminAxios