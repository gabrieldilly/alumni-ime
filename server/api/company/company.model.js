'use strict';

export default function(sequelize, DataTypes) {
  return sequelize.define('Company', {
    CompanyId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    LinkedinId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      unique: true
    },
    IndustryId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      references: {
        model: 'Industry',
        key: 'IndustryId'
      }
    },
    Name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    Type: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Size: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    tableName: 'Company'
  });
}
