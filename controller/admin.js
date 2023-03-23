
const db = require("../config/server");
const bcrypt = require("bcrypt");
const { Admin } = require('../model/admin_Schema')
const { Products } = require('../model/product_Shema')
const { Users } = require("../model/user_Schema")
const { Category } = require('../model/category_Schema')
const fs = require('fs')
const adminlog = (req,res)=>{
        res.render('adminLogin',{layout:'/partials/layout'});
    }


const adminAddProduct = async(req,res)=>{
    console.log(req.body);
    let Categories = req.body.category;
    console.log(Categories);
          const category = await Category.findOne({name:Categories})
           if(!category){
            console.log("category invalid");
           }
    if(category){
   let data = category.id.toString();
    const product = new Products ({
        
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
        product.save().then((productsadded)=>{
        res.redirect('/admin'),
        console.log(productsadded);
    })}
}
const adminHome = async(req,res)=>{
    await Category.find().then(data=>{
        res.render("adminHome",{data,layout:'/partials/layout'});
    })
   
}
const adminLogin = async(req, res) => {
    try{
    console.log(req.body);
    let Email = req.body.email;
    let PASS = req.body.password;
    const admin = await Admin.findOne({ email: Email})
    if(!admin){
        res.redirect("/admin/adminlogin")
    }
    if (admin){
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

const adminSignup = async(req, res, next)=>{
    try{
     console.log(req.body);
     const admin = new Admin({
        
         email:req.body.email,
         password:req.body.password
     });
     admin.save().then(result=>{
         console.log(result);
         res.redirect('/admin');
     })
    }
    catch(err){
      next(err);
     }
  }

  
  const adminViewProduct = async(req,res)=>{
        await Products.find().then((items)=>{
     console.log(items);
     res.render('adminViewProduct',{items,layout:'/partials/layout'})
  })
        
  }


  const adminViewUsers = async(req,res)=>{
    await Users.find().then((user)=>{
 console.log(user);
 res.render('adminViewUsers',{user,layout:'/partials/layout'})
})}
  
const adminLogout = (req,res)=>{
    req.session.destroy(err=>{
        if(err)throw err;
        res.redirect('/admin/adminlogin')
    })
}
const addCategory = async(req,res)=>{
    const category = new Category({
        name: req.body.name,
        image:req.file.filename,
    })
    category.save().then(result=>{
        console.log(result);
        
           

    })
    if(!category)
    return res.status(400).send('the category cannot be created!')
    else{res.redirect('/admin');}
}

const editProduct = (req,res)=>{
    let id = req.params.id;
    Products.findById(id).then(product=>{
        
            res.render('adminEditProduct',{product,layout:'/partials/layout'})
        })
    }

const editCategory = (req,res)=>{
    let id = req.params.id;
    Category.findById(id).then((category)=>{
       
            res.render('adEditCat',{category,layout:'/partials/layout'})
        })
    }


const adminViewCategory =(req,res)=>{
    Category.find().then(categories=>{
        
            res.render('adminviewcategory',{categories,layout:'/partials/layout'})
        
    })
}

const deleteProduct = (req,res)=>{
    let id = req.params.id;
    console.log(id);
    Products.findByIdAndRemove(id).then(result=>{
       
        console.log(result);
        res.redirect("/admin/adminviewproducts");
    });
}
const deleteCategory = (req,res)=>{
    let id = req.params.id;
    Category.findByIdAndRemove(id).then(result=>{
       
        console.log(result);
        res.redirect("/admin/adminviewcategories");
    });
}
const listProducts = async (req, res) => {
    try{
        let id = req.params.id;
        console.log(id);
        const product_list = await Products.find({category:id})
        console.log(product_list)
        res.render("adminViewCat",{product_list,layout:'/partials/layout'}); 
      
    }
    catch(err){
      console.log(err);
    }
  }
  const updateProduct = async(req,res)=>{
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
    Products.findByIdAndUpdate(id,{
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        brand: req.body.brand,
        image: new_image,
        price: req.body.price,
        category:  req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: Boolean(featured),
    }).then(data=>{console.log(data,'lkjgvldkdfjgvlkdjgkrjfgokrjrkojrddedrdf');
    res.redirect('/admin/adminviewproducts')})
}



  const updateCategory = async(req,res)=>{
let id = req.params.id ;
await Category.findByIdAndUpdate(id,{
    name:req.params.name,
    image:req.body.image    
}).then(data=>{
    console.log(data);
    res.redirect('/admin/adminviewcategories')
})
  }

module.exports = {
    adminLogin,
    adminViewProduct,
    adminlog,
    adminSignup,
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
    
}