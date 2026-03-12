const express = require("express");
const jwt     = require("jsonwebtoken");
const Admin   = require("../models/Admin");

const router = express.Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { employeeId, password } = req.body;

    if (!employeeId || !password)
      return res.status(400).json({ error: "Employee ID and password are required" });

    const admin = await Admin.findOne({ employeeId: employeeId.trim(), isActive: true });
    if (!admin)
      return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: admin._id, employeeId: admin.employeeId, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id:         admin._id,
        employeeId: admin.employeeId,
        name:       admin.name,
        role:       "admin",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error during login" });
  }
});

// GET /api/auth/verify  — frontend can call this to check if token is still valid
router.get("/verify", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ valid: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin   = await Admin.findById(decoded.id).select("-password");
    if (!admin || !admin.isActive) return res.status(401).json({ valid: false });

    res.json({ valid: true, user: { ...admin.toObject(), role: "admin" } });
  } catch {
    res.status(401).json({ valid: false });
  }
});

module.exports = router;