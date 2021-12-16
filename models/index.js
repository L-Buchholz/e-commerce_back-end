// import models
const Product = require("./Product");
const Category = require("./Category");
const Tag = require("./Tag");
const ProductTag = require("./ProductTag");

// Products belongsTo Category (only one Category per Product)
Product.belongsTo(Category, {
  foreignKey: "category_id",
});

// Categories have many Products (many Products per Category)
Category.hasMany(Product, {
  foreignKey: "category_id",
  onDelete: "CASCADE",
});

// Products belongsToMany Tags (through ProductTag)
Product.belongsToMany(Tag, {
  // Creates association [.]through: <Name of associated table> (as const instead of string)
  through: ProductTag,
  onDelete: "CASCADE",
});

// Tags belongsToMany Products (through ProductTag)
Tag.belongsToMany(Product, {
  // Creates association [.]through: <Name of associated table> (as const instead of string)
  through: ProductTag,
  onDelete: "CASCADE",
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
