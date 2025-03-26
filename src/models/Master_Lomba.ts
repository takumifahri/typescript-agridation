import express from 'express';
import { db } from '../config/database';
import { Model, DataTypes } from 'sequelize';


class MasterLombaList extends Model {
    public id!: number;
    public nama_lomba!: string;
    public deskripsi!: string;
    public total_peminat_tahun_lalu!: number;
    public total_peminat_tahun_sekarang!: number;
    public link_gdrive?: string;
}
  
    MasterLombaList.init(
        {
            id: { type: DataTypes.INTEGER.UNSIGNED, autoIncrement: true, primaryKey: true },
            nama_lomba: { type: DataTypes.STRING, allowNull: false },
            deskripsi: { type: DataTypes.TEXT, allowNull: false },
            total_peminat_tahun_lalu: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
            total_peminat_tahun_sekarang: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
            link_gdrive: { type: DataTypes.STRING, allowNull: true },
        },
        {
            sequelize:db,
            tableName: "master_lombas",
            timestamps: true,
        }
    );
    
export default MasterLombaList;