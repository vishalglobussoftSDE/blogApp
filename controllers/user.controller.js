import { userModel } from "../models/user.model.js";
import jwt from 'jsonwebtoken'
export const registerUser = async(req, res)=>{
  const { username, email, password ,role} = req.body;

  // Basic validation
  if (!username || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    // Create new user (store plain password — NOT secure, for demo only)
    const newUser = new userModel({
      username,
      email,
      password,
      role
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
}
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required' });

  try {
    const user = await userModel.findOne({ email });

    if (!user)
      return res.status(404).json({ error: 'User not found' });

    if (user.password !== password)
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    // console.log(process.env.JWT_SECRET)

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};


export const editUserProfile = async (req, res) => {
  const { username, email, password, imgUrl } = req.body;
  const userId = req.user.userId; // From authenticated token

  if (!username && !email && !password && !imgUrl) {
    return res.status(400).json({ error: 'At least one field is required to update' });
  }

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      {
        ...(username && { name: username }),
        ...(email && { email }),
        ...(password && { password }), // ⚠️ Should hash this in real apps
        ...(imgUrl && { imgUrl })
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({
      message: '✅ Profile updated successfully',
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        imgUrl: updatedUser.imgUrl
      }
    });
  } catch (error) {
    console.error('❌ Error updating user profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};