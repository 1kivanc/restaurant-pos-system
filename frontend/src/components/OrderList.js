import React, { useEffect, useState } from "react";
import { getOrders, closeOrder, deleteOrder } from "../services/orderService";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  Divider,
  Button,
  IconButton,
  Box,
  Badge,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import { format } from "date-fns";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [viewClosed, setViewClosed] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getOrders();
      setOrders(data);
    };
    fetchOrders();
  }, []);

  const openOrders = orders.filter((order) => order.status === "open");
  const closedOrders = orders.filter((order) => order.status === "closed");

  const handlePayment = async (order) => {
    try {
      await closeOrder(order._id);
      generateReceipt(order);
      const updatedOrders = await getOrders();
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Ödeme yapılırken hata oluştu:", error);
    }
  };

  const handleDeleteOrder = async () => {
    try {
      await deleteOrder(selectedOrder._id);
      const updatedOrders = await getOrders();
      setOrders(updatedOrders);
      setOpenConfirm(false);
    } catch (error) {
      console.error("Sipariş silinirken hata oluştu:", error);
    }
  };

  const generateReceipt = (order) => {
    const receiptContent = `
      <h2>Sipariş Fişi</h2>
      <p><strong>Masa Numarası:</strong> ${order.table_number}</p>
      <p><strong>Müşteri:</strong> ${order.customer_name}</p>
      <p><strong>Not:</strong> ${order.notes || "Not yok"}</p>
      <hr />
      <h4>Ürünler:</h4>
      <ul>
        ${order.items
          .map(
            (item) =>
              `<li>${item.product.name} x ${item.quantity} - ${item.product.price}₺</li>`
          )
          .join("")}
      </ul>
      <hr />
      <p><strong>Toplam:</strong> ${order.total_price}₺</p>
    `;

    const receiptWindow = window.open("", "", "width=400,height=600");
    receiptWindow.document.write(`
      <html>
        <head>
          <title>Sipariş Fişi</title>
          <style>
            body { font-family: Arial, sans-serif; }
            h2 { text-align: center; }
            ul { list-style: none; padding-left: 0; }
            li { margin-bottom: 5px; }
            p { margin: 5px 0; }
          </style>
        </head>
        <body>
          ${receiptContent}
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
  };

  const generateEndOfDayReceipt = (closedOrders) => {
    const totalRevenue = closedOrders.reduce(
      (total, order) => total + order.total_price,
      0
    );

    const receiptContent = `
      <h2>Gün Sonu Raporu</h2>
      <p><strong>Toplam Ciro:</strong> ${totalRevenue}₺</p>
      <hr />
      <h4>Kapanan Siparişler:</h4>
      <ul>
        ${closedOrders
          .map(
            (order) =>
              `<li>Masa: ${order.table_number}, Müşteri: ${order.customer_name}, Toplam: ${order.total_price}₺</li>`
          )
          .join("")}
      </ul>
    `;

    const receiptWindow = window.open("", "", "width=400,height=600");
    receiptWindow.document.write(`
      <html>
        <head>
          <title>Gün Sonu Raporu</title>
          <style>
            body { font-family: Arial, sans-serif; }
            h2 { text-align: center; }
            ul { list-style: none; padding-left: 0; }
            li { margin-bottom: 5px; }
            p { margin: 5px 0; }
          </style>
        </head>
        <body>
          ${receiptContent}
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
  };

  const handleEndOfDay = async () => {
    generateEndOfDayReceipt(closedOrders);
    try {
      for (const order of closedOrders) {
        await deleteOrder(order._id);
      }
      const updatedOrders = await getOrders();
      setOrders(updatedOrders);
    } catch (error) {
      console.error("Gün sonu işlemi sırasında hata oluştu:", error);
    }
  };

  const handleOpenConfirm = (order) => {
    setSelectedOrder(order);
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
    setSelectedOrder(null);
  };
  const formatOrderTime = (order) => {
    return format(new Date(order.order_date), "HH:mm");
  };
  console.log(formatOrderTime);

  return (
    <Container>
      <Box display="flex" justifyContent="center" mb={4} mt={4}>
        <Button
          variant="contained"
          color={viewClosed ? "default" : "primary"}
          onClick={() => setViewClosed(false)}
          style={{ marginRight: "10px" }}
        >
          Açık Hesaplar
        </Button>
        <Button
          variant="contained"
          color={viewClosed ? "primary" : "default"}
          onClick={() => setViewClosed(true)}
        >
          Kapalı Hesaplar
        </Button>
      </Box>

      {viewClosed ? (
        closedOrders.length === 0 ? (
          <Typography className="text-center text-gray-500">
            Kapalı hesap yok.
          </Typography>
        ) : (
          <>
            <Box display="flex" justifyContent="flex-end" mb={4}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleEndOfDay}
              >
                Gün Sonu
              </Button>
            </Box>
            <Grid container spacing={4}>
              {closedOrders.map((order) => (
                <Grid item xs={12} sm={6} md={4} key={order._id}>
                  <Card
                    sx={{
                      backgroundColor: "#f9f9f9",
                      borderRadius: "10px",
                      boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Masa Numarası: {order.table_number}
                      </Typography>
                      <Typography variant="body1">
                        Müşteri: {order.customer_name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Not: {order.notes || "Not yok"}
                      </Typography>
                      <Divider className="my-3" />
                      <Typography variant="body1" gutterBottom>
                        Ürünler:
                      </Typography>
                      {order.items.map((item) => (
                        <div key={item.product._id}>
                          <Typography variant="body2">
                            {item.product.name} x {item.quantity}
                          </Typography>
                        </div>
                      ))}
                      <Divider className="my-3" />
                      <Typography variant="h6" color="primary">
                        Toplam: {order.total_price}₺
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button variant="contained" disabled>
                        Kapandı
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )
      ) : openOrders.length === 0 ? (
        <Typography className="text-center text-gray-500">
          Açık hesap yok.
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {openOrders.map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order._id}>
              <Card
                sx={{
                  backgroundColor: "#f9f9f9",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Masa Numarası: {order.table_number}
                  </Typography>
                  <Typography variant="body1">
                    Müşteri: {order.customer_name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Not: {order.notes || "Not yok"}
                  </Typography>
                  <Divider className="my-3" />
                  <Typography variant="body1" gutterBottom>
                    Ürünler:
                  </Typography>
                  {order.items.map((item) => (
                    <div key={item.product._id}>
                      <Typography variant="body2">
                        {item.product.name} x {item.quantity}
                      </Typography>
                    </div>
                  ))}
                  <Divider className="my-3" />
                  <Typography variant="h6" color="primary">
                    Toplam: {order.total_price}₺
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handlePayment(order)}
                  >
                    Ödeme Al
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleOpenConfirm(order)}
                  >
                    İptal
                  </Button>
                </CardActions>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    paddingRight: "16px",
                    paddingBottom: "8px",
                  }}
                >
                  <Typography variant="caption" color="textSecondary">
                    {`Oluşturulma Saati: ${formatOrderTime(order)}`}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Siparişi İptal Et"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bu siparişi iptal etmek istediğinizden emin misiniz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm} color="primary">
            Hayır
          </Button>
          <Button onClick={handleDeleteOrder} color="secondary" autoFocus>
            Evet
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrderList;
