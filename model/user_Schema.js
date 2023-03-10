const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
var moment = require('moment');
const { max } = require('moment');


const userSchema = new mongoose.Schema
(
             {
                name: {
                    type: String,
                    required: true
                  },
                  mobile: {
                    type: Number,
                    required: true
                   
                  },
                email: {
                  type: String,
                  required: true
                 
                },
                password: {
                  type: String,
                  required: true,
                  max:(20)
                 
                },
            });

            userSchema.pre('save', function(next) {
              const user = this;
              if (!user.isModified('password')) {
                return next();
              }
            
              bcrypt.genSalt(15, function(err, salt) {
                if (err) {
                  return next(err);
                }
            
                bcrypt.hash(user.password, salt, function(err, hash) {
                  if (err) {
                    return next(err);
                  }
            
                  user.password = hash;
                  next();
                });
              });
            });
          
           
const users = mongoose.model('users', userSchema)

module.exports = {users}









// const userSchema = new mongoose.Schema
//     (
//         {
//             name: {
//                 type: String,
//                 required: true,
//                 trim: true
//             },
//             email: {
//                 type: String,
//                 required: true,
//                 unique: true,
//                 trim: true
//             },
//             mobile: {
//                 type: String,
//                 required: true,
//                 trim: true
//             },
//             password: {
//                 type: String,
//                 required: true,
//                 trim: true,
//                 minlength: [6]
//             },
//             isBanned: {
//                 type: Boolean,
//                 default: false
//             },
//             cart: [
//                 {
//                     product_id: {
//                         type: mongoose.Schema.Types.ObjectId,
//                         ref: 'Products',
//                     },
//                     quantity: {
//                         type: Number,
//                         default: 1
//                     },
//                     total: {
//                         type: Number,
//                         required: true
//                     },
//                 }
//             ],
//             cartDiscout: {
//                 type: String
//             },
//             wishlist: [
//                 {
//                     product_id: {
//                         type: mongoose.Schema.Types.ObjectId,
//                         ref: 'Products',
//                     }
//                 }
//             ],
//             address: [
//                 {
//                     default: {
//                         type: Boolean,
//                         default: false
//                     },
//                     firstname: {
//                         type: String,
//                         required: true
//                     },
//                     lastname: {
//                         type: String,
//                         required: true
//                     },
//                     address: {
//                         type: String,
//                         required: true
//                     },
//                     city: {
//                         type: String,
//                         required: true
//                     },
//                     state: {
//                         type: String,
//                         required: true
//                     },
//                     pincode: {
//                         type: Number,
//                         required: true
//                     },
//                     phone: {
//                         type: Number,
//                         required: true
//                     }
//                 }
//             ],
//             wallet: {
//                 balance: {
//                     type: Number,
//                     default: 0,
//                     min: 0
//                 },

//                 history: [{
//                     order: {
//                         type: String
//                     },
//                     date: {
//                         type: String,
//                         default: moment(Date.now()).format('DD-MM-YYYY')
//                     },
//                     amount: {
//                         type: Number
//                     },
//                     type: {
//                         type: String
//                     }

//                 }]
//             }
//         },
//         {
//             timestamps: true
//         }
//     )

// const usermodel = mongoose.model('users', userSchema)