import { db } from "./database";
import User from "../models/user";
import Token from "../models/token";
import dotenv from 'dotenv';

dotenv.config();


const syncDatabase = async() => {
    try{

        await db.authenticate();
        console.log("Database connected!");

        // Drop Token table first to avoid foreign key constraint issues
        await Token.drop();
        console.log("Dropped 'tokens' table.");

        // Drop User table after Token
        await User.drop();
        console.log("Dropped 'users' table.");

        // Sync User first to ensure the users table exists
        await User.sync({ force: true });
        console.log("Synchronized 'users' table.");

        // Then sync Token to ensure the foreign key constraint is valid
        await Token.sync({ force: true });
        console.log("Synchronized 'tokens' table.");

        console.log("All models were synchronized successfully.");  
        process.exit();

    }catch(err){
        console.error("Failed to sync database:", err);
        process.exit(1);
    }
}

syncDatabase();