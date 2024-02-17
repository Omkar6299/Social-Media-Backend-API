import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
        minLength: [1, 'Content should not be empty'],
        maxLength: [200, 'Content should not exceed 200 characters']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    likeCount:{
         type:Number,
         default:0,
    },
    replies: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required:true
        },
        post: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required:true
        },
        content: {
            type: String,
            minLength: [1, 'Content should not be empty'],
            maxLength: [200, 'Content should not exceed 200 characters'],
            required:true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

const CommentModel = mongoose.model("Comment", commentSchema);
export default CommentModel;
