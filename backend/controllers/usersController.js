const User = require("../models/User");
const Note = require("../models/Notes");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

//desc Gat all users
//@route GET /users
//@access private
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();

  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);
});

//desc Create new user
//@route POST /users
//@access private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "All fields are mandatory" });
  }

  //check for duplicate
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username " });
  }

  //hash password
  const hashPassword = await bcrypt.hash(password, 10);

  const userObject = { username, password: hashPassword, roles };
  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

//desc Update a user
//@route PATCH /users
//@access private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;

  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "All fields are mandatory" });
  }

  //check user
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  //check for duplicate
  const duplicate = await User.findOne({ username }).lean().exec();
  //we need to exclude the user that we are logged in and working on it.
  //if the id requested in the body and the id created by MongoDB are not equal
  //then the user is duplicate user.
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate user" });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;
  //If the password is provided by the user for change then it will update it.
  if (password) {
    //Hash password
    user.password = await bcrypt.hash(password, 10);
  }
  const updatedUser = await user.save();
  res.json({ message: `${updatedUser.username} updated` });
});

//desc Delete a user
//@route delete /users
//@access private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID is required" });
  }

  //Check if the user has notes assigned to it
  const note = await Note.findOne({ user: id }).lean().exec();
  if (note) {
    return res.status(400).json({ message: "User has notes assigned" });
  }
  //Find and Delete the user
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  const deletedUser = await user.deleteOne();
  const reply = `Username ${deletedUser.username} with ID ${deletedUser._id} deleted`;
  res.json(reply);
});

module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };
