
const mongoose = require('mongoose');
const { ObjectId} =require('mongodb')

    const orderSchema = new mongoose.Schema({
    
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        products: [{
            // product: {
            //     type: String,
            //     ref: "products",
            //     required: true,
            // },
            // quantity: {
            //     type: Number,
            //     default: 1,
            //     required: true
            // },
            // daysOfRent:{
                // type: Number,
            //     required: true
            // },
            // total:{
            //     type: Number,
            //     required: true
            // },
            // price:{
            //     type: Number,
            //     required: true
            // }
        }],
        deliveryAddress: {
            Address:{
                type:String,
                required:true
            },
            city: {
                type: String,
                required: true
            },
            state: {
                type: String,
                required: true
            },
            country: {
                type: String,
                required: true
            },
            pin: {
                type: String,
                required: true
            }
        },
        orderDate: {
            type: Date,
            default: Date.now
        },
        deliveryExpectedDate: {
            type: Date
        },
        payment: {
            type: String,
            required: true,
            default: "COD"
        },
        razorPayDetails: {
            orderId: {
                type: String,
                default: null
            },
            paymentId: {
                type: String,
                default: null
            }
        },
        orderStatus: {
            type: String,
            default: "Confirmed"
        },
        paymentStatus: {
            type: String,
            default: "pending"
        },
        couponApplied: {
            type: Boolean,
            default: false
        },
        couponCode: {
            type: String,
            default: null
        },
         discountPrice: {
            type: String,
            default: null
        },
        subTotalPrice: {
            type: Number
        },
        totalPrice: {
            type: Number
        },
        orderId: {
            type: String,
            default: null
    }
    });
    

orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true,
});


const Order = mongoose.model('orders', orderSchema);
module.exports = { Order }

// const orderSchema = new mongoose.Schema(
   
//        ,
       
// )
// const Orders =  mongoose.model('orders',orderSchema);
// module.exports = { Orders };