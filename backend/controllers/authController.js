import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error("❌ Error registering user:", error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

export const login = async (req, res) => {
  console.log("📥 Login request body:", req.body);

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found for email:", email);
      return res.status(400).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("❌ Invalid password for user:", user.email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log("✅ Password match. Creating JWT...");
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log("✅ Token generated:", token);
    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });

  } catch (error) {
    console.error("❌ Error logging in:", error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

export const forgotPassword = (req, res) => {
  res.send("Forgot Password Placeholder");
};
