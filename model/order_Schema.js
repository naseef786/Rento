const orderSchema = new mongoose.Schema(
    {
      orderId: {
        type: String,
        
    },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },
        product: [{
          productId:{type:String,
            ref:"product",
            required: [true],
        } ,
          quantity:{
            type:Number,
            default:1,
            required: [true]
          } ,
          totalPrice:{
            type:Number
          }
        }],

      deliveryAddress: {
            type: Object,
            required: true
        },
        Order_date: {
            type: String,
            default: new Date(Date.now()).toLocaleDateString()
        },
        Delivery_Expected_date: {
            type: String,
        },
            Payment: {
            type: String,
            required: true,
            default:"COD"
        },
        paypalDetails: {
          id:{
          type: String,
          default: null
          },
          payer_id:{
            type: String,
            default:null
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
        couponapplied: {
            type: Boolean,
            default: false
        },
        couponCode: {
          type: String,
          default: null
      },
        cartDiscount: {
            type: String
        },
        subTotalPrice: {
            type: Number
        },
        discountPrice: {
            type: Number,
            default: 0
        },
        totalPrice: {
            type: Number
        }

    },
    {
        timestamps: true
    } 
)