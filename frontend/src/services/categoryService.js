import API_BASE_URL from "../config";

export const getCategories = async () => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  return await response.json();
};

export const createCategory = async (category) => {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });

  if (!response.ok) {
    throw new Error("Kategori ekleme hatası");
  }

  return await response.json();
};

export const updateCategory = async (categoryId, updatedCategory) => {
  const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedCategory),
  });

  if (!response.ok) {
    throw new Error("Kategori güncelleme hatası");
  }

  return await response.json();
};

export const deleteCategory = async (categoryId) => {
  const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Kategori silme hatası");
  }

  return await response.json();
};
