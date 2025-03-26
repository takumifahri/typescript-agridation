import { db } from "../config/database";
import Token from "../models/token";
import dotenv from "dotenv";
import User from "../models/user";
import TeamList from "../models/List_Team";
import Penilaian from "../models/Penilaian";
import MasterLombaList from "../models/Master_Lomba";

dotenv.config();

const syncDatabase = async () => {
    try {
        await db.authenticate();
        console.log("✅ Database connected!");

        // Hapus tabel dalam urutan dari yang paling dependent ke yang paling independen
        await Penilaian.drop();
        console.log("🗑 Dropped 'penilaians' table.");

        await Token.drop();
        console.log("🗑 Dropped 'tokens' table.");

        await User.drop();
        console.log("🗑 Dropped 'users' table.");

        await TeamList.drop();
        console.log("🗑 Dropped 'teams' table.");

        await MasterLombaList.drop();
        console.log("🗑 Dropped 'master_lombas' table.");

        console.log("\n🔄 Syncing tables...\n");

        // Sinkronkan dalam urutan yang benar
        await MasterLombaList.sync({ force: true });
        console.log("✅ Synchronized 'master_lombas' table.");

        await TeamList.sync({ force: true });
        console.log("✅ Synchronized 'teams' table.");

        await User.sync({ force: true });
        console.log("✅ Synchronized 'users' table.");

        await Token.sync({ force: true });
        console.log("✅ Synchronized 'tokens' table.");

        await Penilaian.sync({ force: true });
        console.log("✅ Synchronized 'penilaians' table.");

        console.log("\n🚀 All models were synchronized successfully!");
        process.exit();
    } catch (err) {
        console.error("Failed to sync database:", err);
        process.exit(1);
    }
};

syncDatabase();
