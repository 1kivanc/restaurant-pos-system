const Product = require("../models/productModel");
const Category = require("../models/categoryModel");

const createProduct = async (req, res) => {
  try {
    const { name, price, categoryId, imageUrl } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Kategori bulunamadı" });
    }

    const product = new Product({
      name,
      price,
      category: categoryId,
      imageUrl,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Ürün eklenirken hata oluştu" });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Ürünler getirilirken hata oluştu" });
  }
};
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, categoryId, imageUrl } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Kategori bulunamadı" });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { name, price, category: categoryId, imageUrl },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Ürün güncellenirken hata oluştu" });
  }
};
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Ürün bulunamadı" });
    }

    res.status(200).json({ message: "Ürün başarıyla silindi" });
  } catch (error) {
    res.status(500).json({ message: "Ürün silinirken hata oluştu" });
  }
};

module.exports = { createProduct, getProducts, updateProduct, deleteProduct };
