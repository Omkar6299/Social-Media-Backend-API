import mongoose, { Schema } from "mongoose";

const friendSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // Index on the user field
    },
    friend: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // Index on the friend field
    },
    status: {
        type: String,
        enum: {
            values: ["add friend", "requested", "pending", "friend"],
            message: "'{VALUE}' is not a valid status. Choose from sent, accept, reject, or pending."
        },
        default:"add friend",
        required: true,
    }
}, { timestamps: true });

friendSchema.pre("save", async function(next) {
    if (this.isNew && this.status === 'requested') {
        try {
            // Update the status on the friend's side to pending
            await mongoose.model('Friend').findOneAndUpdate(
                { user: this.friend, friend: this.user },
                { status: 'pending' },
                { upsert: true }
            );
        } catch (error) {
            console.error(error);
            throw error; // Re-throw the error to handle it elsewhere
        }
    }
    next();
});

// Compound index example:
friendSchema.index({ user: 1, status: 1 });

const friendModel = mongoose.model("Friend", friendSchema);
export default friendModel;
