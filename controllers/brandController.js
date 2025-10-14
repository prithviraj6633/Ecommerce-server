const fs = require('fs');
const path = require('path');
const Brand = require('../models/brandModel');

const baseURL = 'http://localhost:7000/uploads/';

// Helper to delete image file
const deleteImageFile = (filename) => {
  if (!filename) return;
  const filePath = path.join(__dirname, '..', 'uploads', filename);
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (!err) {
      fs.unlink(filePath, (err) => {
        if (err) console.error('Error deleting image file:', err);
      });
    }
  });
};

// Get all brands
const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.findAll();
    const updatedBrands = brands.map(b => ({
      id: b.id,
      bName: b.bName,
      bImage: b.bImage ? `${baseURL}${b.bImage}` : null,
    }));
    res.status(200).json({ success: true, brands: updatedBrands });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};

// Get brand by ID
const getBrandById = async (req, res) => {
  try {
    const { ID } = req.params;
    const brand = await Brand.findByPk(ID);
    if (!brand) return res.status(404).json({ success: false, msg: 'Brand not found' });

    res.status(200).json({
      success: true,
      brand: {
        id: brand.id,
        bName: brand.bName,
        bImage: brand.bImage ? `${baseURL}${brand.bImage}` : null,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};

// Create brand
const createBrand = async (req, res) => {
  try {
    const bName = req.body.bName;
    const bImage = req.file ? req.file.filename : null;

    if (!bName || !bImage)
      return res.status(400).json({ success: false, msg: 'Brand name and image are required' });

    const newBrand = await Brand.create({ bName, bImage });

    res.status(201).json({
      success: true,
      msg: 'Brand created successfully',
      brand: {
        id: newBrand.id,
        bName: newBrand.bName,
        bImage: `${baseURL}${newBrand.bImage}`,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Server error', error: err.message });
  }
};

// Update brand
const updateBrand = async (req, res) => {
  try {
    const { ID } = req.params;
    const brand = await Brand.findByPk(ID);
    if (!brand) return res.status(404).json({ success: false, msg: 'Brand not found' });

    // If new image uploaded, delete old image
    if (req.file && brand.bImage) {
      deleteImageFile(brand.bImage);
      brand.bImage = req.file.filename;
    }

    brand.bName = req.body.bName || brand.bName;

    await brand.save();

    res.status(200).json({
      success: true,
      msg: 'Brand updated successfully',
      brand: {
        id: brand.id,
        bName: brand.bName,
        bImage: brand.bImage ? `${baseURL}${brand.bImage}` : null,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};

// Delete brand
const deleteBrand = async (req, res) => {
  try {
    const { ID } = req.params;
    const brand = await Brand.findByPk(ID);
    if (!brand) return res.status(404).json({ success: false, msg: 'Brand not found' });

    // Delete image file
    if (brand.bImage) deleteImageFile(brand.bImage);

    // Delete DB record
    await brand.destroy();

    res.status(200).json({ success: true, msg: 'Brand deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Server error' });
  }
};

module.exports = {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
};
