const Product = require("../models/Product");
const formidable = require("formidable");
const _ = require("lodash");
// this import not required intallation
const fs = require("fs");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, Product) => {
      if (err || !Product) {
        return res.status(400).json({
          error: "Product not available",
        });
      }
      req.product = Product;
      next();
    });
};

exports.getProduct = (req, res) => {
  const product = req.product;
  product.photo = undefined;
  return res.json(product);
};

// middleware
exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with Image",
      });
    }
    // destructture the fields
    const { name, description, price, category, stock } = fields;
    // here give restiction on finished
    // console.log("All Fields", fields);

    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please includes all fields",
      });
    }

    let product = new Product(fields);

    // handle file here
    // console.log("File Photo::", file.photo);
    if (file.photo == undefined) {
      return res.status(400).json({
        error: "Please Upload Photo",
      });
    }
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size os Big !",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    // save to the DB
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Saving Tshirt in DB failed",
        });
      }
      res.json(product);
    });
  });
};

// Delete controllers
exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deleteProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete product",
      });
    }
    res.json({
      message: `Deletion was a successfully ${deleteProduct.name}`,
    });
  });
};

// Update controllers
exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem with Image",
      });
    }
    //updation code
    let product = req.product;
    product = _.extend(product, fields);

    // handle file here
    // console.log("File Photo::", file.photo);
    if (file.photo == undefined) {
      return res.status(400).json({
        error: "Please Upload Photo",
      });
    }
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size os Big !",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    // save to the DB
    product.save((err, product) => {
      if (err) {
        res.status(400).json({
          error: "Updation Tshirt in DB failed",
        });
      }
      res.json(product);
    });
  });
};

//all products
exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        res.status(400).json({ error: "No Product found" });
      }
      res.json(products);
    });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      res.status(400).json({
        error: "No Category found",
      });
    }
    res.json(category);
  });
};

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });
  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk Operation failed",
      });
    }
    next();
  });
};
