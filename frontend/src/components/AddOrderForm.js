import React, { useState } from "react";
import { createProduct } from "../services/productService";

const AddProductForm = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = { name, price, categoryId, imageUrl };
    await createProduct(newProduct);
    alert("Ürün başarıyla eklendi!");
    setName("");
    setPrice("");
    setCategoryId("");
    setImageUrl("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Ürün Adı:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label>Fiyat:</label>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />

      <label>Kategori ID:</label>
      <input
        type="text"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        required
      />

      <label>Resim URL'si:</label>
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        required
      />

      <button type="submit">Ürün Ekle</button>
    </form>
  );
};

export default AddProductForm;
