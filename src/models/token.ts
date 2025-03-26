import sequelize from "sequelize";
import { db } from "../config/database";
import { DataTypes, Model } from "sequelize";
import User from "./user";

class Token extends Model {
  public id!: number;
  public UserId!: number;
  public accessToken!: string;
  public refreshToken!: string;
  public expiresAt!: Date;
  public createdAt!: Date;
  }
  
  Token.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: { // Ensure this matches the column name
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: User,
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize: db,
      tableName: "tokens",
      timestamps: true,
    }
  );
  
  // Relasi: User memiliki banyak Token
  User.hasMany(Token, { foreignKey: "userId", as: "tokens" });
  Token.belongsTo(User, { foreignKey: "userId", as: "user" });
  
export default Token;