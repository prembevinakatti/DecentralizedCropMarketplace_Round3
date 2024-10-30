const mongoose = require("mongoose");
const userModel = require("../models/userModel");

module.exports.createuser = async (req, res) => {
  try {
    const { fullName, userId, email, phoneNumber, metamaskId, role } = req.body;
    console.log(fullName, userId, email, phoneNumber, metamaskId, role);
    if (
      !fullName ||
      !userId ||
      !email ||
      !phoneNumber ||
      !metamaskId ||
      !role
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await userModel.findOne({
      userId: userId,
    });

    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }

    const newUser = await userModel.create({
      fullName: fullName,
      userId: userId,
      email: email,
      phoneNumber: phoneNumber,
      metamaskId: metamaskId,
      role: role,
    });

    return res
      .status(200)
      .send({ message: "User created successfully", newUser, success: true });
  } catch (error) {
    console.log("Error creating user in server: ", error);
  }
};

module.exports.getLocalAgents = async (req, res) => {
  try {
    const localAgents = await userModel.find({ role: "localagent" });
    return res.status(200).send({
      message: "Local agents retrieved successfully",
      localAgents,
      success: true,
    });
  } catch (error) {
    console.log("Error getting local agents in server: ", error.message);
  }
};
module.exports.getUser = async (req, res) => {
  try {
    const id = req.params.id;

    // Check if ID is provided
    if (!id) {
      return res.status(400).json({ msg: "User ID is required", role: null });
    }

    // Fetch user details from the database
    const userDetails = await userModel.findOne({ userId: id }); // Changed to findOne to get a single user

    // Check if user exists
    if (!userDetails) {
      return res.status(404).json({ msg: "User not found", role: null });
    }

    // If user exists, return their role
    return res.status(200).json({ msg: "User found", role: userDetails.role });
  } catch (error) {
    // Handle any errors
    console.error(error);
    return res.status(500).json({ msg: "An error occurred", role: null });
  }
};

module.exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const user = await userModel.findOne({ userId: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    
    return res
      .status(200)
      .json({ message: "User retrieved successfully.", user });
  } catch (error) {
    console.log("Error Getting User By Id : " + error.message);
  }
};


module.exports.getUserByMetamaskId = async (req, res) => {
  try {
    const metamaskId = req.params.id;

    if (!metamaskId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const user = await userModel.findOne({ metamaskId : metamaskId.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res
      .status(200)
      .json({ message: "User retrieved successfully.", user });
  } catch (error) {
    console.log("Error Getting User By Id : " + error.message);
  }
};