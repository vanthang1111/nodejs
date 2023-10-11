'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Price extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Price.hasMany(models.Product);
      // Price.hasMany(models.Size);
      Price.belongsTo(models.Product);
      Price.belongsTo(models.Size);
    }
  }
  Price.init({
    SizeId: DataTypes.INTEGER,
    ProductId: DataTypes.STRING,
    price: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Price',
  });
  return Price;
};