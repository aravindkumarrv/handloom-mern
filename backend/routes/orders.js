const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const Product = require("../models/Product");

// ======================================================
// CREATE ORDER
// ======================================================
router.post("/", async (req, res) => {
  try {
    const { productId, customerName, phone, address, quantity } = req.body;

    if (!productId || !customerName || !phone || !address || !quantity) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (!product.available) {
      return res.status(400).json({ message: "Product is not available." });
    }

    if (Number(quantity) > product.stock) {
      return res.status(400).json({
        message: `Only ${product.stock} items available.`,
      });
    }

    const totalPrice = Number(quantity) * product.price;

    const order = await Order.create({
      product: product._id,
      customerName,
      phone,
      address,
      quantity: Number(quantity),
      totalPrice,
      status: "Pending",
    });

    // Reduce stock
    product.stock -= Number(quantity);
    await product.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("product");

    res.status(201).json(populatedOrder);

  } catch (err) {
    console.error("Create order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================================================
// GET ALL ORDERS
// ======================================================
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("product")
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    console.error("Get orders error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================================================
// TOGGLE ORDER STATUS
// ======================================================
router.patch("/:id/status", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    order.status =
      order.status === "Pending" ? "Shipped" : "Pending";

    await order.save();

    res.json({
      _id: order._id,
      status: order.status,
    });

  } catch (err) {
    console.error("Toggle status error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================================================
// DELETE ORDER (RESTORES STOCK)
// ======================================================
router.delete("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Restore stock
    const product = await Product.findById(order.product);
    if (product) {
      product.stock += order.quantity;
      await product.save();
    }

    await order.deleteOne();

    res.json({ message: "Order deleted successfully." });

  } catch (err) {
    console.error("Delete order error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
