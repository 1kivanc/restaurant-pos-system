import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import CategoryList from "./components/CategoryList";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import { createOrder, getOrders } from "./services/orderService";
import OrderList from "./components/OrderList";
import {
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Badge,
  Typography,
  Box,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import "./App.css";

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openOrderCount, setOpenOrderCount] = useState(0);

  useEffect(() => {
    const fetchOpenOrders = async () => {
      const orders = await getOrders();
      const openOrders = orders.filter((order) => order.status === "open");
      setOpenOrderCount(openOrders.length);
    };
    fetchOpenOrders();
  }, []);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const addToCart = (product) => {
    const existingProduct = cartItems.find((item) => item._id === product._id);
    if (existingProduct) {
      setCartItems(
        cartItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((item) => item._id !== id));
  };

  const updateQuantity = (id, quantity) => {
    setCartItems(
      cartItems.map((item) => (item._id === id ? { ...item, quantity } : item))
    );
  };

  const handleCreateOrder = async (order) => {
    try {
      const response = await createOrder(order);
      console.log("Sipariş başarıyla oluşturuldu:", response);
      setCartItems([]);
      const orders = await getOrders();
      const openOrders = orders.filter((order) => order.status === "open");
      setOpenOrderCount(openOrders.length);
    } catch (error) {
      console.error("Sipariş oluşturulamadı:", error);
    }
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  return (
    <Router>
      <div className="App">
        <AppBar
          position="fixed"
          style={{
            backgroundColor: "white",
            minHeight: "50px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Container style={{ minWidth: "1400px" }}>
            <Toolbar
              style={{
                padding: 0,
                minHeight: "50px",
                justifyContent: "space-between",
              }}
            >
              <Box display="flex" alignItems="center">
                <Typography
                  variant="h6"
                  color="primary"
                  style={{ marginRight: "20px" }}
                >
                  POS
                </Typography>
                <Link to="/">
                  <IconButton color="inherit">
                    <HomeIcon />
                  </IconButton>
                </Link>
              </Box>
              <Box display="flex" alignItems="center">
                <Link to="/orders">
                  <IconButton color="inherit">
                    <Badge badgeContent={openOrderCount} color="secondary">
                      <ListAltIcon />
                    </Badge>
                  </IconButton>
                </Link>
                <IconButton color="primary" onClick={handleFullscreen}>
                  <FullscreenIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>

        <Toolbar />

        <Box boxShadow={3} />

        <Routes>
          <Route
            path="/"
            element={
              <div className="main-content">
                <aside className="categories">
                  <CategoryList onCategorySelect={handleCategorySelect} />
                </aside>

                {/* Ürünler */}
                <main className="products">
                  <ProductList
                    selectedCategory={selectedCategory}
                    addToCart={addToCart}
                  />
                </main>

                {/* Sepet */}
                <aside className="cart">
                  <Cart
                    cartItems={cartItems}
                    removeFromCart={removeFromCart}
                    updateQuantity={updateQuantity}
                    createOrder={handleCreateOrder}
                  />
                </aside>
              </div>
            }
          />
          <Route path="/orders" element={<OrderList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
