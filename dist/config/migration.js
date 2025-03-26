"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("./database");
const user_1 = __importDefault(require("../models/user"));
const token_1 = __importDefault(require("../models/token"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const syncDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.db.authenticate();
        console.log("Database connected!");
        // Drop Token table first to avoid foreign key constraint issues
        yield token_1.default.drop();
        console.log("Dropped 'tokens' table.");
        // Drop User table after Token
        yield user_1.default.drop();
        console.log("Dropped 'users' table.");
        // Sync User first to ensure the users table exists
        yield user_1.default.sync({ force: true });
        console.log("Synchronized 'users' table.");
        // Then sync Token to ensure the foreign key constraint is valid
        yield token_1.default.sync({ force: true });
        console.log("Synchronized 'tokens' table.");
        console.log("All models were synchronized successfully.");
        process.exit();
    }
    catch (err) {
        console.error("Failed to sync database:", err);
        process.exit(1);
    }
});
syncDatabase();
