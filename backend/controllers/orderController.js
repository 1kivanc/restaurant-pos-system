const Order = require("../models/orderModel");
const Product = require("../models/productModel");

const createOrder = async (req, res) => {
  try {
    const { table_number, customer_name, items, notes } = req.body;

    let total_price = 0;
    const populatedItems = [];

    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: "Ürün bulunamadı" });
      }
      total_price += product.price * item.quantity;
      populatedItems.push({ product: product._id, quantity: item.quantity });
    }

    const order = new Order({
      table_number,
      customer_name,
      items: populatedItems,
      notes,
      total_price,
      status: "open",
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error("Sipariş oluşturulurken hata:", error);
    res
      .status(500)
      .json({ message: "Sipariş oluşturulurken hata oluştu", error });
  }
};

const getOrders = async (req, res) => {
  try {
    const { status } = req.query;
    let orders;

    if (status) {
      orders = await Order.find({ status }).populate("items.product");
    } else {
      orders = await Order.find().populate("items.product");
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Siparişler getirilirken hata oluştu" });
  }
};

const closeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Sipariş bulunamadı" });
    }

    order.status = "closed";
    await order.save();

    res.status(200).json({ message: "Sipariş başarıyla kapatıldı", order });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Sipariş kapatılırken hata oluştu", error });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findByIdAndDelete(orderId);
    if (!order) {
      return res.status(404).json({ message: "Sipariş bulunamadı" });
    }

    res.status(200).json({ message: "Sipariş başarıyla silindi" });
  } catch (error) {
    res.status(500).json({ message: "Sipariş silinirken hata oluştu", error });
  }
};
const findOpenOrderByTableNumber = async (tableNumber) => {
  return await Order.findOne({ table_number: tableNumber, status: "open" });
};

const updateOrder = async (req, res) => {
  try {
    const { table_number, items } = req.body;
    const openOrder = await findOpenOrderByTableNumber(table_number);

    if (!openOrder) {
      return res.status(404).json({ message: "Açık sipariş bulunamadı" });
    }

    items.forEach((newItem) => {
      const existingItem = openOrder.items.find(
        (item) => item.product.toString() === newItem.product
      );
      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        openOrder.items.push(newItem);
      }
    });

    let total_price = 0;
    for (let item of openOrder.items) {
      const product = await Product.findById(item.product);
      total_price += product.price * item.quantity;
    }
    openOrder.total_price = total_price;

    await openOrder.save();
    res.status(200).json(openOrder);
  } catch (error) {
    console.error("Sipariş güncellenirken hata:", error);
    res.status(500).json({ message: "Sipariş güncellenirken hata oluştu" });
  }
};

const createOrUpdateOrder = async (req, res) => {
  try {
    const { table_number, customer_name, items, notes } = req.body;

    const openOrder = await findOpenOrderByTableNumber(table_number);

    if (openOrder) {
      req.body.items = items;
      return updateOrder(req, res);
    }
    let total_price = 0;
    const populatedItems = [];

    for (let item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: "Ürün bulunamadı" });
      }
      total_price += product.price * item.quantity;
      populatedItems.push({ product: product._id, quantity: item.quantity });
    }

    const newOrder = new Order({
      table_number,
      customer_name,
      items: populatedItems,
      notes,
      total_price,
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Sipariş oluşturulurken hata:", error);
    res.status(500).json({ message: "Sipariş oluşturulurken hata oluştu" });
  }
};

module.exports = {
  createOrder,
  getOrders,
  closeOrder,
  deleteOrder,
  createOrUpdateOrder,
};
