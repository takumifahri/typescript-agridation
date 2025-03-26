import { Model, DataTypes } from "sequelize";
import { db } from "../config/database";
import User from "./user";
import TeamList from "./List_Team";
import MasterLombaList from "./Master_Lomba";

class Penilaian extends Model {
    public id!: number;
    public team_id!: number;
    public lomba_id!: number;
    public juri_id!: number;
    public nilai!: number;
    public attachment_file?: string;
    public status!: "rejected" | "accepted";
  }
  
  Penilaian.init(
    {
      id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
      team_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, references: { model: "teams", key: "id" } },
      lomba_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, references: { model: "master_lombas", key: "id" } },
      juri_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, references: { model: "users", key: "id" } },
      nilai: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
      attachment_file: { type: DataTypes.STRING, allowNull: true },
      status: { type: DataTypes.ENUM("rejected", "accepted"), allowNull: false },
    },
    {
      sequelize: db,
      tableName: "penilaians",
      timestamps: true,
    }
  );
  
  User.hasMany(Penilaian, { foreignKey: "juri_id", as: "penilaians" });
  User.belongsTo(TeamList, { foreignKey: "teamId", as: "team" });
  TeamList.hasMany(User, { foreignKey: "teamId", as: "members" });
  TeamList.belongsTo(MasterLombaList, { foreignKey: "lomba_id", as: "lomba" });
  Penilaian.belongsTo(TeamList, { foreignKey: "team_id", as: "team" });
  Penilaian.belongsTo(MasterLombaList, { foreignKey: "lomba_id", as: "lomba" });

export default Penilaian;