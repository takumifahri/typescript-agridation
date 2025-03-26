"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const database_1 = require("../config/database");
const sequelize_1 = require("sequelize");
class Token extends sequelize_1.Model {
}
Token.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
            model: user_1.default,
            key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    },
    token: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    expiresAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
}, {
    sequelize: database_1.db,
    tableName: "tokens",
    timestamps: true,
});
// Relasi: User memiliki banyak Token
user_1.default.hasMany(Token, { foreignKey: "userId", as: "tokens" });
Token.belongsTo(user_1.default, { foreignKey: "userId", as: "user" });
exports.default = Token;
