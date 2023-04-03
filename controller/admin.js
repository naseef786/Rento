
const db = require("../config/server");
const bcrypt = require("bcrypt");
const { Admin } = require('../model/admin_Schema')
const { Products } = require('../model/product_Shema')
const { Users } = require("../model/user_Schema")
const { Category } = require('../model/category_Schema')
const { Coupon } = require('../model/coupon_Schema');
const { Order } = require('../model/order_Schema')
const fs = require('fs');
const { remove } = require("lodash");




const adminlog = (req, res) => {
  res.render('adminLogin', { layout: '/partials/layout' });
}



const adminHome = async (req, res) => {
  const { addCategoryexist, addCategoryerror, addCategory } = req.session
  let data = await Category.find()
  let items = await Products.find()

  res.render("adminHome", { data, items, layout: '/partials/layout', msg_exist: addCategoryexist, msg_error: addCategoryerror, msg_add: addCategory });
  req.session.addCategoryerror = false
  req.session.addCategoryexist = false
  req.session.addCategory = false



}
const adminLogin = async (req, res) => {
  try {
    console.log(req.body);
    let Email = req.body.email;
    let PASS = req.body.password;
    const admin = await Admin.findOne({ email: Email })
    if (!admin) {
      res.redirect("/admin/adminlogin")
    }
    if (admin) {
      console.log(admin);
      let data = await bcrypt.compare(PASS, admin.password);
      console.log(data);
      if (data) {
        req.session.adminLogged = true;
        req.session.admin_id = admin._id
        res.redirect('/admin');
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

const adminSignup = async (req, res, next) => {
  try {
    console.log(req.body);
    const admin = new Admin({

      email: req.body.email,
      password: req.body.password
    });
    admin.save().then(result => {
      console.log(result);
      res.redirect('/admin');
    })
  }
  catch (err) {
    next(err);
  }
}


const adminViewProduct = async (req, res) => {
  await Products.find().then((items) => {
    console.log(items);
    res.render('adminViewProduct', { items, layout: '/partials/layout' })
  })

}

const UpdateProfile = async (req, res) => {
  try {
      const id = req.session.admin_id
      const email = req.body.email
      const password = req.body.password

      const updateUser = await Admin.findByIdAndUpdate({_id : id }, { $set: { email: email,password:password } })

      if (updateUser) {

          res.redirect("/admin")
      }

  } catch (error) {
      console.log(error.message);
  }
}





const adminViewUsers = async (req, res) => {
  await Users.find().then((user) => {
    console.log(user);
    res.render('adminViewUsers', { user, layout: '/partials/layout' })
  })
}
const adminManageUsers = async (req,res)=>{

}



const addCategory = async (req, res) => {
  try {
    const name = req.body.name;
    let regExp = new RegExp(`^${name}`, 'i')
    let find = await Category.findOne({ name: { $regex: regExp } })
    console.log(find);
    if (find) {
      req.session.addCategoryexist = true
      res.redirect("/admin/addcategory");
    } else {
      const category = new Category({
        name: req.body.name,
        image: req.file.filename,
        description: req.body.description
      })
      category.save().then(result => {
        console.log(result);
      })
      req.session.addCategory = true;
      res.redirect("/admin")
    }

  }
  catch {
    console.log(err);
  }
}

const adminViewCategory = (req, res) => {
  Category.find().then(categories => {

    res.render('adminviewcategory', { categories, layout: '/partials/layout' })

  })
}


const editCategory = (req, res) => {
  let id = req.params.id;
  Category.findById(id).then((category) => {

    res.render('adEditCat', { category, layout: '/partials/layout' })
  })
}

const updateCategory = async (req, res) => {
  let id = req.params.id;
  let new_image = "";

  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync("./public/images/uploads" + req.body.old_image);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body.old_image;
  }
  await Category.findByIdAndUpdate(id, {
    name: req.params.name,
    image: new_image,
    description: req.body.description
  }).then(data => {
    console.log(data);
    res.redirect('/admin/adminviewcategories')
  })
}
const deleteCategory = async (req, res) => {
  try {
    let { id } = req.params
    let del = await Category.deleteOne({ _id: id })

    if (del.deletedCount === 0) {
      res.send({ msg_deleteerr: true })
    }
    else if (del.deletedCount === 1) {
      res.send({ msg_delete: true })
    }
  }
  catch (err) {
    console.log(err);
  }
}



const adminAddProduct = async (req, res) => {
  console.log(req.body);
  let Categories = req.body.category;
  console.log(Categories);
  const category = await Category.findOne({ name: Categories })
  if (!category) {
    console.log("category invalid");
  }
  if (category) {
    let data = category.id.toString();
    const product = new Products({

      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      brand: req.body.brand,
      image: req.file.filename,
      price: req.body.price,
      category: data,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,

    });
    product.save().then((productsadded) => {
      console.log(productsadded);
      let object = { product_Id: productsadded.id }
      category.products.push(object)
      category.save();
      res.redirect('/admin')

    })
  }
}

const listProducts = async (req, res) => {
  try {
    let id = req.params.id;
    console.log(id);
    const product_list = await Products.find({ category: id })
    console.log(product_list)
    res.render("adminViewCat", { product_list, layout: '/partials/layout' });

  }
  catch (err) {
    console.log(err);
  }
}
const updateProduct = async (req, res) => {
  let new_image = "";

  if (req.file) {
    new_image = req.file.filename;
    try {
      fs.unlinkSync("./public/images/uploads" + req.body.old_image);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body.old_image;
  }
  let featured = req.body.isFeatured;

  let id = req.params.id;
  let update = await Products.updateOne({_id:id},{$set:{
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    brand: req.body.brand,
    image: new_image,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: Boolean(featured),
  }})
  if(update.modifiedCount==0){
    req.session.product_updateerr=true
      res.send(msg=true)
  }
  else if(update.modifiedCount==1){
    req.session.product_update=true
    res.send(msg=true)
  }
  }






let editProductSubmit =async(req,res) =>{
    
  try{
    console.log(req.body)
  let { name, description, price, color, size, quantity, category,new_image} = req.body
  // position = JSON.parse(req.body.position)
  
  
  let productId =req.params.id
   let find=await Products.findOne({_id:ObjectId(productId)})
    // let {image}=find
    // let i=0
    // position.forEach(element => {
    //   image[element]=imageMulter[i]
    //   i++
    // });

  let update =await Products.updateOne({_id:ObjectId(productId)},{$set:
    {name, description, price, color, size, quantity, category, image
    }})
    if(update.modifiedCount==0){
      req.session.product_updateerr=true
        res.send(msg=true)
    }
    else if(update.modifiedCount==1){
      req.session.product_update=true
      res.send(msg=true)
    }
  }
  catch(err){
    err.admin = true;
      next(err);  
  }
  }

const editProduct = (req, res) => {
  let id = req.params.id;
  Products.findById(id).then(product => {
    res.render('adminEditProduct', { product, layout: '/partials/layout' })
  })
}

const deleteProduct = async (req, res) => {
  let id = req.params.id;
  console.log(id);
  await Products.findByIdAndRemove(id).then(result => {
    fs.unlinkSync(`./public/images/uploads/${result.image}`);
    Category.findByIdAndUpdate(result.category._id, { $pull: { products: { _id: result._id } } })
    res.redirect("/admin/adminviewproducts");
  });
}







//   const addCoupon =  async (req, res) => {
//     const { code, discount, expiration } = req.body;

//     // Validate the incoming data
//     if (!code || !discount || !expiration) {
//       return res.status(400).send('Missing required fields');
//     }

//     try {
//       // Create a new coupon object
//       const coupon = new Coupon({
//         code,
//         discount,
//         expiration: new Date(expiration),
//       });

//       // Save the coupon to the database
//       await coupon.save();

//       res.status(201).send('Coupon created successfully');
//     } catch (err) {
//       console.error(err);
//       res.status(500).send('Server error');
//     }
//   };







const adminViewWish = async (req, res) => {
  // retrieve the wishlist array from the userSchema for the current user
  const currentProduct = await Products.findById(req.params.id).populate('wishList');
  const wishlistedUsers = currentProduct.wishList;

  // fetch the product details for each product id in the wishlist array
  const users = [];
  for (let i = 0; i < wishlistedUsers.length; i++) {
    const user = await Users.findById(wishlistedUsers[i]._id);
    users.push(user);
  }
  console.log(users);

  // pass the array of product details to the wishlist.hbs page
  res.render('adminViewWish', { users, layout: "partials/layout" });
};


const postCreateCoupon = async (req, res, next) => {
  try {
    console.log(req.body)
    let { couponName, couponCode, percentDiscount, quantity, startDate, endDate, maximumDiscount, minimumSpend, } = req.body
    let couponFound = await Coupon.findOne({ couponCode })
    if (!couponFound) {
      let coupn = new Coupon({
         couponName: couponName,
         couponCode: couponCode,
         percentDiscount: percentDiscount,
         quantity: quantity,
         startDate: startDate,
         endDate: endDate,
         maximumDiscount: maximumDiscount,
         minimumSpend: minimumSpend,
        
      })
      coupn.save().then(data => {
        console.log(data);
        res.redirect('/admin')
      })
    }
    else {
      res.send({ exist: true })
    }
  }
  catch (err) {
    err.admin = true;
    next(err);
  }
};


const manageCoupons = async (req, res) => {
  await Coupon.find().then(data => {
    console.log(data);
    res.render('adminViewCoupons', { data, layout: '/partials/layout' })
  })
}
const deleteCoupon = async(req,res)=>{
  let id = req.params.id
  await Coupon.findByIdAndRemove(id).then(()=>{
    console.log("coupon deleted");
    res.redirect('/admin/managecoupons')
  })
}

const manageOrder = async (req,res)=>{
    const orderList = await Order.find().populate('user', 'name').sort({'dateOrdered': -1});

    if(!orderList) {
        res.status(500).json({success: false})
    } 
    res.render('adminViewOrders',orderList)
}
const orderDetails = async (req, res) =>{
  const order = await Order.findById(req.params.id)
  .populate('user', 'name')
  .populate({ 
      path: 'orderItems', populate: {
          path : 'product', populate: 'category'} 
      });

  if(!order) {
      res.status(500).json({success: false})
  } 
  res.send(order);
}


const adminLogout = (req, res) => {
  req.session.destroy(err => {
    if (err) throw err;
    res.redirect('/admin/adminlogin')
  })
}
module.exports = {
  adminLogin,
  adminViewProduct,
  adminlog,
  adminSignup,
  UpdateProfile,
  adminHome,
  adminAddProduct,
  adminViewUsers,
  adminLogout,
  addCategory,
  editCategory,
  editProduct,
  deleteProduct,
  deleteCategory,
  adminViewCategory,
  listProducts,
  updateCategory,
  updateProduct,
  postCreateCoupon,
  manageCoupons,
  adminViewWish,
  adminManageUsers,
  manageOrder,
  deleteCoupon,
  

}