import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
    caption: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
        unique:true
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref:"User"
    },
    commentCount:{
        type:Number,
        default:0
    },
    likeCount:{
        type:Number,
        default:0,
   }
}, {
    timestamps: true
});

const PostModel = mongoose.model("Post", postSchema);

export default PostModel;