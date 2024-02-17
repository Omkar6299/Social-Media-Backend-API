import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    likeable: {
        type: Schema.Types.ObjectId,
        refPath: "on_model",
    },
    on_model: {
        type: String,
        enum: ["Comment", "Post"],
    },
});

const likeModel = mongoose.model("Like", likeSchema);
export default likeModel;