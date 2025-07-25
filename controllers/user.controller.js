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
  const { username, email, password,name} = req.body;
  const userId = req.user.userId;
  const imgFile = req.file;

  if (!username && !email && !password && !imgFile && !name) {
    return res.status(400).json({ error: 'Nothing to update' });
  }

  const updateData = {};
  if (username) updateData.name = username;
  if (email) updateData.email = email;
  if (password) updateData.password = password;
  if(name) updateData.name = name;
  if (imgFile) {
    updateData.imgUrl = `data:${imgFile.mimetype};base64,${imgFile.buffer.toString('base64')}`;
    // You can replace this with cloud upload (S3, Cloudinary, etc.)
  }

  try {
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: '✅ Profile updated',
      user: updatedUser
    });
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
export const logOutUser = async(req,res)=>{
  res.send('working')
}