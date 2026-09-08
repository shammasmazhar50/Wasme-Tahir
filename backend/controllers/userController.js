const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] } // Don't send passwords to frontend
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      password: hashedPassword,
      role: role || 'author'
    });

    res.status(201).json({ id: newUser.id, username: newUser.username, role: newUser.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating user' });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, role } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.username === 'admin') {
      if (username && username !== 'admin') {
        return res.status(400).json({ message: 'Cannot change the username of the main admin' });
      }
      if (role && role !== 'admin') {
        return res.status(400).json({ message: 'Cannot change the role of the main admin' });
      }
    }

    if (username) user.username = username;
    if (role) user.role = role;
    
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ id: user.id, username: user.username, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating user' });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting the last admin
    if (req.user.id == id) {
      return res.status(400).json({ message: 'You cannot delete yourself' });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.username === 'admin') {
      return res.status(400).json({ message: 'Cannot delete the main admin account' });
    }

    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting user' });
  }
};
