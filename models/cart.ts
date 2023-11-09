import mongoose from 'mongoose';
const cartSchema = new mongoose.Schema({
    customer: {
        type: String
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        // required: true
    },
    // vendorName:{
    //     type:String
    // },
    // vendorContact:{
    //     type: String
    // },
    productName:{
        type: String
    },
    productDescription:{
        type: String
    },
    quantity:{
        type: Number,
        default: 1
    },
    price:{
        type: String,
    },
    productImage:{
        type: String
    },
}, {timestamps: true})

export default mongoose.model("dusstech-cart", cartSchema)