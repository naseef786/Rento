
const db = require("../config/server");
const bcrypt = require("bcrypt");




const adminLogin = (req,res)=>{
    res.render("adminHome")
}
const adminViewProduct = (req,res)=>{
    res.render("contact")
}

module.exports = {
    adminLogin,
    adminViewProduct
}