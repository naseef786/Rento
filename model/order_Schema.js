
const mongoose = require('mongoose');
const { ObjectId} =require('mongodb')
const orderSchema = new mongoose.Schema({
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required:true
    }],
    shippingAddress1: {
        type: String,
        required: true,
    },
    shippingAddress2: {
        type: String,
    },
    city: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'Pending',
    },
    totalPrice: {
        type: Number,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    dateOrdered: {
        type: Date,
        default: Date.now,
    },
})

orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true,
});


const Order = mongoose.model('orders', orderSchema);
module.exports = { Order }

// const orderSchema = new mongoose.Schema(
//     {
//       orderId: {
//         type: String,
        
//     },
//         userId: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "users",
//             required: true
//         },
//         product: [{
//           productId:{type:String,
//             ref:"product",
//             required: true,
//         } ,
//           quantity:{
//             type:Number,
//             default:1,
//             required: [true]
//           } ,
//           totalPrice:{
//             type:Number
//           }
//         }],

//       deliveryAddress: {
//             type: Object,
//             required: true
//         },
//         Order_date: {
//             type: String,
//             default: new Date(Date.now()).toLocaleDateString()
//         },
//         Delivery_Expected_date: {
//             type: String,
//         },
//             Payment: {
//             type: String,
//             required: true,
//             default:"COD"
//         },
//         paypalDetails: {
//           id:{
//           type: String,
//           default: null
//           },
//           payer_id:{
//             type: String,
//             default:null
//             }
//         },
//         orderStatus: {
//           type: String,
//           default: "Confirmed"
//       },
//       paymentStatus: {
//         type: String,
//         default: "pending"
//     },
//         couponapplied: {
//             type: Boolean,
//             default: false
//         },
//         couponCode: {
//           type: String,
//           default: null
//       },
//         cartDiscount: {
//             type: String
//         },
//         subTotalPrice: {
//             type: Number
//         },
//         discountPrice: {
//             type: Number,
//             default: 0
//         },
//         totalPrice: {
//             type: Number
//         }

//     },
//     {
//         timestamps: true
//     } 
// )
// const Orders =  mongoose.model('orders',orderSchema);
// module.exports = { Orders };