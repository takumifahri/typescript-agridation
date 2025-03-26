import express from 'express';
import { db } from '../config/database';
import { Model, DataTypes } from 'sequelize';   

class TeamList extends Model {
    public id!: number;
    public name_team!: string;
    public lomba_id!: number;
    public status!: string;
    public peringkat?: number;
}

TeamList.init(
    {
        id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
        name_team: { type: DataTypes.STRING, allowNull: false },
        lomba_id: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false, references: { model: "master_lombas", key: "id" } },
        status: { type: DataTypes.STRING, allowNull: false },
        peringkat: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true },
    },
    {
        sequelize:db,
        tableName: "teams",
        timestamps: true,
    }
);

export default TeamList;