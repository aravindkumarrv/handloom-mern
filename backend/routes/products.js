// backend/routes/products.js
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const multer = require("multer");
const path = require("path");

// ---------- Placeholder image used if no file uploaded ----------
const PLACEHOLDER_IMAGE =
  "https://via.placeholder.com/600x400.png?text=Handloom+Product";

// (Optional) default products for seeding when DB empty
const defaultProducts = [
  {
    name: "Traditional Cotton Saree",
    category: "Saree",
    price: 1800,
    image: PLACEHOLDER_IMAGE,
    description: "Handwoven cotton saree with traditional motifs.",
    available: true,
    stock: 10,
  },
];

// ---------- Multer config for image upload ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ---------- PUBLIC: GET /api/products (only available=true) ----------
router.get("/", async (req, res) => {
  try {
    let products = await Product.find({ available: true }).sort({
      createdAt: -1,
    });

    // Seed defaults if DB empty (optional)
    if (products.length === 0 && defaultProducts.length > 0) {
      const seeded = defaultProducts.map((p) => ({
        ...p,
        available: true,
      }));
      await Product.insertMany(seeded);
      products = await Product.find({ available: true }).sort({
        createdAt: -1,
      });
    }

    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------- ADMIN: GET /api/products/admin (all products) ----------
router.get("/admin", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Error fetching admin products:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------- ADMIN: POST /api/products (add with image upload) ----------
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, category, price, description, stock } = req.body;

    // DEBUG: See what actually arrives from frontend
    console.log("Creating product with body:", req.body);

    if (!name || !category || !price || !description) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    const numericPrice = Number(price);
    if (!numericPrice || numericPrice <= 0) {
      return res
        .status(400)
        .json({ message: "Please provide a valid price." });
    }

    const numericStock =
      typeof stock === "undefined" || stock === "" ? 0 : Number(stock);

    if (Number.isNaN(numericStock) || numericStock < 0) {
      return res
        .status(400)
        .json({ message: "Please provide a valid stock (0 or more)." });
    }

    let imageUrl = PLACEHOLDER_IMAGE;

    if (req.file) {
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    const newProduct = await Product.create({
      name: name.trim(),
      category: category.trim(),
      price: numericPrice,
      image: imageUrl,
      description: description.trim(),
      available: true,
      stock: numericStock,
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Error creating product:", err);
    // IMPORTANT: send real error message to frontend while debugging
    res.status(400).json({ message: err.message || "Server error" });
  }
});

// ---------- ADMIN: PATCH /api/products/:id/availability ----------
router.patch("/:id/availability", async (req, res) => {
  try {
    const { available } = req.body;
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { available },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error updating availability:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ---------- ADMIN: DELETE /api/products/:id ----------
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully." });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
