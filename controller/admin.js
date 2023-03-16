
const db = require("../config/server");
const bcrypt = require("bcrypt");
const { Admin } = require('../model/admin_Schema')
const { Products } = require('../model/product_Shema')
const { Users } = require("../model/user_Schema")
const { Category } = require('../model/category_Schema')

const adminlog = (req,res)=>{
        res.render('adminLogin');
    }


const adminAddProduct = (req,res)=>{
    const product = new Products ({
        image:req.file.filename,
        name:req.body.name,
        price:req.body.price,
        discription:req.body.discription
  
    });
        product.save().then((productsadded)=>{
        res.redirect('/admin'),
        console.log(productsadded);
    })
}
const adminHome = (req,res)=>{
    res.render("adminHome");
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
     res.render('addProduct',{items})
  })
        
  }


  const adminViewUsers = async(req,res)=>{
    await Users.find().then((user)=>{
 console.log(user);
 res.render('adminViewUsers',{user})
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
    Products.findById(id).then((product)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render('edit',{product})
        }
    })
}
const editCategory = (req,res)=>{
    let id = req.params.id;
    Category.findById(id).then((category)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render('edit',{category})
        }
    })
}
const adminViewCategory =(req,res)=>{
    Category.find().then(categories=>{
        if(err){
            res.json({message:err.message})
        }
        else{
            res.render('adminviewcategory',{categories})
        }
    })
}

const deleteProduct = (req,res)=>{
    let id = req.params.id;
    Products.findByIdAndRemove(id).then(result=>{
        if(err){console.log(err);}
        else{console.log(result);}
        res.redirect("/admin/adminviewproducts");
    });
}
const deleteCategory = (req,res)=>{
    let id = req.params.id;
    Category.findByIdAndRemove(id).then(result=>{
        if(err){console.log(err);}
        else{console.log(result);}
        res.redirect("/admin/adminviewcategory");
    });
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
    adminViewCategory
    
}