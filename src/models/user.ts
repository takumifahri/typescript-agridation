import { DataTypes, Model } from "sequelize";
import { hashPassword, comparePassword } from "../utils/HashPassword"; // Import fungsi hash
import { db } from "../config/database";

class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: "peserta" | "juri" | "admin";
  public phone_number?: string;
  public asal_sekolah!: string;
  public email_verified_at?: Date;
  public isActive!: boolean;
  public teamId?: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public async isPasswordValid(password: string): Promise<boolean> {
    return comparePassword(password, this.password);
  }
}

User.init(
  {
    id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    phone_number: { type: DataTypes.STRING, allowNull: true },
    asal_sekolah: { type: DataTypes.STRING, allowNull: false },
    email_verified_at: { type: DataTypes.DATE, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    role: { type: DataTypes.ENUM("peserta", "juri", "admin"), allowNull: false, defaultValue: "peserta" },
    teamId: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, references: { model: "teams", key: "id" } },
  },
  {
    sequelize:db,
    tableName: "users",
    timestamps: true,
    hooks: {
      beforeCreate: async (user: User) => {
        user.password = await hashPassword(user.password);
      },
      beforeUpdate: async (user: User) => {
        if (user.changed("password")) {
          user.password = await hashPassword(user.password);
        }
      },
    },
  }
);

export default User;