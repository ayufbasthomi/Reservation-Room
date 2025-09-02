"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/auth.ts
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User")); // mongoose schema with TS types
const router = (0, express_1.Router)();
const SECRET = process.env.JWT_SECRET || "your_secret_key";
// Register
router.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    const hashed = await bcryptjs_1.default.hash(password, 10);
    const user = await User_1.default.create({ username, email, password: hashed, role: "user" });
    res.json(user);
});
// Login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User_1.default.findOne({ email });
    if (!user)
        return res.status(401).json({ message: "User not found" });
    const valid = await bcryptjs_1.default.compare(password, user.password);
    if (!valid)
        return res.status(401).json({ message: "Invalid password" });
    const token = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, SECRET, { expiresIn: "1d" });
    res.json({ token, user });
});
// Get profile
router.get("/me", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
        return res.status(401).json({ message: "No token" });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, SECRET);
        res.json(decoded);
    }
    catch {
        res.status(401).json({ message: "Invalid token" });
    }
});
exports.default = router;
