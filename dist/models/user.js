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
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const HashPassword_1 = require("../utils/HashPassword"); // Import fungsi hash
const database_1 = require("../config/database");
class User extends sequelize_1.Model {
    isPasswordValid(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, HashPassword_1.comparePassword)(password, this.password);
        });
    }
}
User.init({
    id: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    email: { type: sequelize_1.DataTypes.STRING, allowNull: false, unique: true },
    password: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    phone_number: { type: sequelize_1.DataTypes.STRING, allowNull: true },
    asal_sekolah: { type: sequelize_1.DataTypes.STRING, allowNull: false },
    email_verified_at: { type: sequelize_1.DataTypes.DATE, allowNull: true },
    isActive: { type: sequelize_1.DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    role: { type: sequelize_1.DataTypes.ENUM("peserta", "juri", "admin"), allowNull: false, defaultValue: "peserta" },
    teamId: { type: sequelize_1.DataTypes.INTEGER.UNSIGNED, allowNull: true, references: { model: "teams", key: "id" } },
}, {
    sequelize: database_1.db,
    tableName: "users",
    timestamps: true,
    hooks: {
        beforeCreate: (user) => __awaiter(void 0, void 0, void 0, function* () {
            user.password = yield (0, HashPassword_1.hashPassword)(user.password);
        }),
        beforeUpdate: (user) => __awaiter(void 0, void 0, void 0, function* () {
            if (user.changed("password")) {
                user.password = yield (0, HashPassword_1.hashPassword)(user.password);
            }
        }),
    },
});
exports.default = User;
