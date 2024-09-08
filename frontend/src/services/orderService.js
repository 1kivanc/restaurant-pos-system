import API_BASE_URL from "../config";

export const getOrders = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`);
    if (!response.ok) {
      throw new Error("Siparişler alınırken bir hata oluştu.");
    }
    return await response.json();
  } catch (error) {
    console.error("Siparişleri alırken hata:", error);
    throw error;
  }
};

export const createOrder = async (order) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    if (!response.ok) {
      throw new Error("Sipariş oluşturulurken bir hata oluştu.");
    }

    return await response.json();
  } catch (error) {
    console.error("Sipariş oluşturulurken hata:", error);
    throw error;
  }
};

export const closeOrder = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/close`, {
      method: "PUT",
    });

    if (!response.ok) {
      throw new Error("Sipariş kapatılırken bir hata oluştu.");
    }

    return await response.json();
  } catch (error) {
    console.error("Sipariş kapatılırken hata:", error);
    throw error;
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Sipariş silinirken bir hata oluştu.");
    }

    return await response.json();
  } catch (error) {
    console.error("Sipariş silinirken hata:", error);
    throw error;
  }
};
