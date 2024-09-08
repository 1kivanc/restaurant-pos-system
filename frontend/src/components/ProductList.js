import React, { useState, useEffect } from "react";
import {
  getProducts,
  updateProduct,
  deleteProduct,
  createProduct,
} from "../services/productService";
import { getCategories } from "../services/categoryService";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const ProductList = ({ selectedCategory, addToCart }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isNewProduct, setIsNewProduct] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      if (selectedCategory) {
        const filtered = data.filter(
          (product) => product.category._id === selectedCategory
        );
        setProducts(filtered);
        setFilteredProducts(filtered);
      } else {
        setProducts(data);
        setFilteredProducts(data);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const results = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchTerm, products]);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const openEditModal = (product) => {
    setEditingProduct({
      ...product,
      categoryId: product.category._id,
    });
    setIsNewProduct(false);
    setShowModal(true);
  };

  const openAddProductModal = () => {
    setEditingProduct({ name: "", price: "", imageUrl: "", categoryId: "" });
    setIsNewProduct(true);
    setShowModal(true);
  };

  const handleUpdateProduct = async () => {
    if (isNewProduct) {
      await createProduct(editingProduct);
    } else {
      await updateProduct(editingProduct._id, editingProduct);
    }
    setShowModal(false);
    const data = await getProducts();
    setProducts(data);
  };

  const handleDeleteProduct = async () => {
    await deleteProduct(editingProduct._id);
    setShowModal(false);
    const data = await getProducts();
    setProducts(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingProduct({ ...editingProduct, [name]: value });
  };

  return (
    <div
      style={{
        padding: "10px",
        position: "relative",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "15px",
          position: "sticky",
          top: "0",
          backgroundColor: "#fff",
          zIndex: 1000,
          padding: "10px 0",
        }}
      >
        <TextField
          label="Ürün Ara"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: "50%",
            borderRadius: "25px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "25px",
            },
          }}
        />
      </div>

      <Grid container spacing={3}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <Grid item key={product._id} xs={12} sm={6} md={4}>
              <Card
                onClick={() => handleAddToCart(product)}
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  alt={product.name}
                  height="140"
                  image={product.imageUrl}
                  title={product.name}
                  sx={{
                    objectFit: "cover",
                    height: 140,
                  }}
                />
                <CardContent sx={{ padding: "8px 12px" }}>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{ fontSize: "1.1rem", fontWeight: "500" }}
                  >
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.price}₺
                  </Typography>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <IconButton
                      aria-label="Düzenle"
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditModal(product);
                      }}
                      sx={{ color: "#3f51b5" }}
                    >
                      <EditIcon />
                    </IconButton>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1">
            Bu kategoride ürün bulunmamaktadır.
          </Typography>
        )}
      </Grid>

      <div
        style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={openAddProductModal}
          sx={{ textTransform: "none" }}
        >
          Yeni Ürün Ekle
        </Button>
      </div>

      {editingProduct && (
        <Dialog open={showModal} onClose={() => setShowModal(false)}>
          <DialogTitle>
            {isNewProduct ? "Yeni Ürün Ekle" : "Ürünü Düzenle"}
          </DialogTitle>
          <DialogContent>
            <TextField
              label="Ürün Adı"
              name="name"
              value={editingProduct.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Fiyat"
              name="price"
              value={editingProduct.price}
              onChange={handleChange}
              fullWidth
              margin="normal"
              type="number"
            />
            <TextField
              label="Resim URL'si"
              name="imageUrl"
              value={editingProduct.imageUrl}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              select
              label="Kategori Seç"
              name="categoryId"
              value={editingProduct.categoryId}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            {!isNewProduct && (
              <Button onClick={handleDeleteProduct} color="error">
                Sil
              </Button>
            )}
            <Button onClick={handleUpdateProduct} color="primary">
              {isNewProduct ? "Ekle" : "Güncelle"}
            </Button>
            <Button onClick={() => setShowModal(false)} color="secondary">
              İptal
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default ProductList;
