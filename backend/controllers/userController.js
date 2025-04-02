import User from '../models/userModel.js';
import Merchant from '../models/merchantModel.js';

// ✅ Create new user (admin only)
export const createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(400).json({ message: 'Username or Email already in use' });

    const user = new User({ username, email, password, role });
    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    console.error('❌ Error creating user:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Get all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Get user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('assignedMerchants');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Update user
export const updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    }).select('-password');

    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Delete user with merchant reassignment
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const { reassignToUserId } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const assignedMerchants = await Merchant.find({ assignedUsers: id });

    // 🛑 Reassignment required
    if (assignedMerchants.length > 0 && !reassignToUserId) {
      return res.status(400).json({
        message: 'User has assigned merchants. Reassignment required before deletion.'
      });
    }

    // ✅ Perform reassignment
    if (assignedMerchants.length > 0 && reassignToUserId) {
      await Promise.all(assignedMerchants.map(async merchant => {
        merchant.assignedUsers = [reassignToUserId]; // enforce one user per merchant
        await merchant.save();
      }));

      await User.findByIdAndUpdate(reassignToUserId, {
        $addToSet: {
          assignedMerchants: { $each: assignedMerchants.map(m => m._id) }
        }
      });
    }

    // ✅ Delete user
    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted and merchants reassigned successfully' });

  } catch (err) {
    console.error('❌ Error in user deletion:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
