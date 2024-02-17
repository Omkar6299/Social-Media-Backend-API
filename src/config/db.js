import mongoose from "mongoose";
import { errorLogger } from "../middleware/logger/logger.middleware.js";

const dbConnector = async () => {
    const dbUrl = process.env.DB_URL;
    try {
        await mongoose.connect(dbUrl);
        console.log("MongoDB is Connected.");
    } catch (error) {
        errorLogger.error(`Error during connecting to the database :- ${error.message}`)
        console.error("Failed to connect database.");
    }
}

export default dbConnector;