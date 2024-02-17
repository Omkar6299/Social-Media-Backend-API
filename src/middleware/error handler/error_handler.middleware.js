import mongoose from "mongoose"
export default class ApplicationError extends Error{
    constructor(errMessage, statusCode){
        super(errMessage);
        this.statusCode=statusCode;
    }
}

export const CustomErrorHandler = async(err,req,res,next)=>{
    if (err instanceof ApplicationError) {
        return res.status(err.statusCode).json({ "status": false, "msg": err.message });
    } else if (err instanceof mongoose.Error.ValidationError || err instanceof mongoose.Error) {
        return res.status(400).json({ "status": false, "msg": err.message });
    } else {
        console.error(err);
        return res.status(500).send('Ops! Something went wrong, please retry...');
    }
}