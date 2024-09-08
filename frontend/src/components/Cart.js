import React, { useState } from "react";
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  IconButton,
  Typography,
  Paper,
  Box,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";

const Cart = ({ cartItems, removeFromCart, updateQuantity, createOrder }) => {
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [tableNumber, setTableNumber] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + item.quantity * item.price,
      0
    );
  };

  const handleCreateOrder = async () => {
    if (cartItems.length === 0) {
      setAlertMessage("Lütfen önce ürün seçiniz.");
      setSnackbarOpen(true);
      return;
    }

    const order = {
      table_number: tableNumber,
      customer_name: customerName,
      items: cartItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      })),
      notes: orderNotes,
    };

    try {
      await createOrder(order);
      console.log("Sipariş başarıyla oluşturuldu/güncellendi");
      setOpen(false);
      setSnackbarOpen(true);
      setAlertMessage("Sipariş başarıyla oluşturuldu!");
    } catch (error) {
      console.error("Sipariş oluşturulamadı:", error);
      setAlertMessage("Sipariş oluşturulamadı.");
      setSnackbarOpen(true);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        padding: "15px",
        marginTop: "20px",
        maxWidth: "100%",
        overflow: "hidden",
        backgroundColor: "#f7f7f7",
        borderRadius: "10px",
      }}
    >
      <Typography variant="h6" gutterBottom>
        Sepetiniz
      </Typography>
      {cartItems.length === 0 ? (
        <Typography variant="body2">Sepetinizde ürün yok.</Typography>
      ) : (
        cartItems.map((item) => (
          <Box
            key={item._id}
            sx={{
              mb: 1,
              padding: "10px",
              backgroundColor: "#fff",
              borderRadius: "5px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1 }}>
              {item.name}
            </Typography>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body2" sx={{ minWidth: "60px" }}>
                {item.price}₺
              </Typography>
              <Box display="flex" alignItems="center">
                <IconButton
                  onClick={() =>
                    updateQuantity(item._id, Math.max(1, item.quantity - 1))
                  }
                  color="primary"
                  size="small"
                >
                  <RemoveIcon />
                </IconButton>
                <TextField
                  value={item.quantity}
                  type="number"
                  inputProps={{ min: 1, style: { textAlign: "center" } }}
                  onChange={(e) =>
                    updateQuantity(
                      item._id,
                      Math.max(1, parseInt(e.target.value))
                    )
                  }
                  sx={{
                    width: "50px",
                    mx: 1,
                    "& input": {
                      padding: "6px",
                      textAlign: "center",
                    },
                  }}
                  size="small"
                />
                <IconButton
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  color="primary"
                  size="small"
                >
                  <AddIcon />
                </IconButton>
              </Box>
              <IconButton
                onClick={() => removeFromCart(item._id)}
                color="error"
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        ))
      )}

      <Box mt={2} display="flex" justifyContent="space-between">
        <Typography variant="subtitle1">Toplam Fiyat:</Typography>
        <Typography variant="subtitle1">{calculateTotalPrice()}₺</Typography>
      </Box>

      {cartItems.length > 0 && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleClickOpen}
          fullWidth
          sx={{ marginTop: "15px", padding: "10px", fontWeight: "bold" }}
        >
          Sipariş Oluştur
        </Button>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Sipariş Bilgilerini Girin</DialogTitle>
        <DialogContent>
          <TextField
            label="Masa Numarası"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            fullWidth
            margin="dense"
            size="small"
          />
          <TextField
            label="Müşteri Adı"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            fullWidth
            margin="dense"
            size="small"
          />
          <TextField
            label="Sipariş Notu"
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            fullWidth
            margin="dense"
            size="small"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            İptal
          </Button>
          <Button onClick={handleCreateOrder} color="primary">
            Sipariş Oluştur
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {alertMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default Cart;
