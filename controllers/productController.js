const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const Brand = require("../models/brandModel");

// ✅ Get ALL products (with Brand & Category names)
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        { model: Category, attributes: ["cName"] },
        { model: Brand, attributes: ["bName"] },
      ],
    });

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// ✅ Get product by ID
const getProductById = async (req, res) => {
  try {
    const { ID } = req.params;

    const product = await Product.findByPk(ID, {
      include: [
        { model: Category, attributes: ["cName"] },
        { model: Brand, attributes: ["bName"] },
      ],
    });

    if (!product)
      return res.status(404).json({ success: false, msg: "Product not found" });

    res.status(200).json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// ✅ Create product
const createProduct = async (req, res) => {
  try {
    const { pName, pDescription, price, quantity, catID, brandID } = req.body;

    if (!pName || !price || !quantity || !catID || !brandID) {
      return res
        .status(400)
        .json({ success: false, msg: "All required fields must be provided" });
    }

    const newProduct = await Product.create({
      pName,
      pDescription,
      price,
      quantity,
      catID,
      brandID,
    });

    res
      .status(201)
      .json({ success: true, msg: "Product created successfully", newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// ✅ Update product
const updateProduct = async (req, res) => {
  try {
    const { ID } = req.params;
    const { pName, pDescription, price, quantity, catID, brandID } = req.body;

    const product = await Product.findByPk(ID);
    if (!product)
      return res.status(404).json({ success: false, msg: "Product not found" });

    product.pName = pName || product.pName;
    product.pDescription = pDescription || product.pDescription;
    product.price = price || product.price;
    product.quantity = quantity || product.quantity;
    product.catID = catID || product.catID;
    product.brandID = brandID || product.brandID;

    await product.save();

    res
      .status(200)
      .json({ success: true, msg: "Product updated successfully", product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

// ✅ Delete product
const deleteProduct = async (req, res) => {
  try {
    const { ID } = req.params;

    const product = await Product.findByPk(ID);
    if (!product)
      return res.status(404).json({ success: false, msg: "Product not found" });

    await product.destroy();
    res
      .status(200)
      .json({ success: true, msg: "Product deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
