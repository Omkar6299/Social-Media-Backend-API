import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Name is required"],
    minlength: [3, "The name should be at least 3 characters long"],
    maxlength: [20, "The name should be at most 20 characters long"],
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: [true, "Email is required"],
    match: [/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/, "Invalid email"],
  },
  password: {
    type: String,
    required: [true, "Password is required"]
  },
  gender: {
    type: String,
    enum: {
      values: ["male", "female", "other"],
      message: "'{VALUE}' is not a valid  gender. Choose from male, female and other only."
    }
  },
  avatar:{
    type: String,
    default:null
  },
  tokens: [{type:String}]
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
