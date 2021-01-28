const User = require("../models/user");
const Category = require("../models/category");

exports.getCaregoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    if (err) {
      return res.status(400).json({
        error: "Category not found in DB",
      });
    }
    // console.log("in param::::", cate);
    req.category = cate;
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({ error: "Not able to save category in DB" });
    }
    res.json({ category });
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};
exports.getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "Category not found",
      });
    }
    res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  let category = req.category;
  // console.log(req.body.name);
  // console.log(category);

  category.name = req.body.name;

  category.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({ error: "Filter to update category" });
    }
    res.json(updatedCategory);
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;
  category.remove((err, category) => {
    if (err) {
      return res.status(400).json({ error: "Failed to delete category" });
    }
    res.json({ Message: `Successfull Deleted ${category.name}` });
  });
};
