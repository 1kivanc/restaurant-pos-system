import React, { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const CategoryList = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleAddOrUpdateCategory = async () => {
    if (newCategory) {
      if (editingCategory) {
        await updateCategory(editingCategory._id, { name: newCategory });
      } else {
        await createCategory({ name: newCategory });
      }
      setNewCategory("");
      setEditingCategory(null);
      setShowModal(false);
      const data = await getCategories();
      setCategories(data);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory(category.name);
    setShowModal(true);
  };

  const handleDeleteCategory = async () => {
    if (editingCategory) {
      await deleteCategory(editingCategory._id);
      const data = await getCategories();
      setCategories(data);
      setShowModal(false);
      setConfirmDeleteModal(false);
    }
  };

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    onCategorySelect(categoryId);
  };

  const handleConfirmDelete = () => {
    setConfirmDeleteModal(true);
  };

  return (
    <div style={{ padding: "10px" }}>
      <h2 style={{ marginBottom: "10px", fontSize: "1.2rem" }}>Kategoriler</h2>
      <List component="nav" style={{ padding: 0 }}>
        <ListItem
          button
          selected={selectedCategory === null}
          onClick={() => handleCategorySelect(null)}
          sx={{
            backgroundColor: selectedCategory === null ? "#e0f7fa" : "white",
            "&:hover": { backgroundColor: "#b2ebf2" },
            padding: "5px 10px",
            marginBottom: "5px",
          }}
        >
          <ListItemText
            primary="Tümü"
            primaryTypographyProps={{ style: { fontSize: "0.9rem" } }}
          />
        </ListItem>
        {categories.map((category) => (
          <ListItem
            button
            key={category._id}
            selected={selectedCategory === category._id}
            onClick={() => handleCategorySelect(category._id)}
            sx={{
              backgroundColor:
                selectedCategory === category._id ? "#e0f7fa" : "white",
              "&:hover": { backgroundColor: "#b2ebf2" },
              padding: "5px 10px",
              marginBottom: "5px",
            }}
          >
            <ListItemText
              primary={category.name}
              primaryTypographyProps={{ style: { fontSize: "0.9rem" } }}
            />
            <IconButton
              onClick={() => handleEditCategory(category)}
              size="small"
              sx={{ marginLeft: "auto" }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setEditingCategory(null);
          setNewCategory("");
          setShowModal(true);
        }}
        style={{
          marginTop: "10px",
          fontSize: "0.8rem",
          padding: "5px 15px",
        }}
      >
        Kategori Ekle
      </Button>
      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        <DialogTitle style={{ fontSize: "1.1rem" }}>
          {editingCategory ? "Kategoriyi Düzenle" : "Yeni Kategori Ekle"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Kategori adı"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)} color="secondary">
            İptal
          </Button>
          {editingCategory && (
            <Button onClick={handleConfirmDelete} color="error">
              Sil
            </Button>
          )}
          <Button onClick={handleAddOrUpdateCategory} color="primary">
            {editingCategory ? "Güncelle" : "Ekle"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmDeleteModal}
        onClose={() => setConfirmDeleteModal(false)}
      >
        <DialogTitle>Kategoriyi Sil</DialogTitle>
        <DialogContent>
          <p>Bu kategoriyi silmek istediğinizden emin misiniz?</p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDeleteModal(false)}
            color="secondary"
          >
            İptal
          </Button>
          <Button onClick={handleDeleteCategory} color="error">
            Sil
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CategoryList;
