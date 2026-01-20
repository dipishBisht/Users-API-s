const data = require('../data/users');

/*
 * CONTROLLER EXPLANATION:
 * Controllers are functions that handle the actual work of your API
 * They receive request (req) and response (res) objects from Express
 * 
 * req = Contains data from the client (body, params, query)
 * res = Used to send data back to the client
 */

// GET all users
const getAllUsers = (req, res) => {
  try {
    // Return all users with 200 OK status
    res.status(200).json({
      success: true,
      count: data.users.length,
      data: data.users
    });
  } catch (error) {
    // If something goes wrong, return 500 error
    res.status(500).json({
      success: false,
      error: "Server error while fetching users"
    });
  }
};

// GET single user by ID
const getUserById = (req, res) => {
  try {
    // req.params contains URL parameters (like :id)
    const userId = parseInt(req.params.id);
    
    // Find user in our data array
    const user = data.users.find(u => u.id === userId);
    
    // If user not found, return 404
    if (!user) {
      return res.status(404).json({
        success: false,
        error: `User with ID ${userId} not found`
      });
    }
    
    // Return found user with 200 OK
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error while fetching user"
    });
  }
};

// POST - Create new user
const createUser = (req, res) => {
  try {
    // req.body contains data sent by the client
    const { name, email, age } = req.body;
    
    // Validation: Check if required fields are present
    if (!name || !email || !age) {
      return res.status(400).json({
        success: false,
        error: "Please provide name, email, and age"
      });
    }
    
    // Check if email already exists
    const emailExists = data.users.find(u => u.email === email);
    if (emailExists) {
      return res.status(400).json({
        success: false,
        error: "Email already in use"
      });
    }
    
    // Create new user object
    const newUser = {
      id: data.getNextId(),
      name,
      email,
      age: parseInt(age),
      createdAt: new Date().toISOString()
    };
    
    // Add to our data array
    data.users.push(newUser);
    
    // Return created user with 201 Created status
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error while creating user"
    });
  }
};

// PUT - Update existing user
const updateUser = (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, email, age } = req.body;
    
    // Find user index in array
    const userIndex = data.users.findIndex(u => u.id === userId);
    
    // If user not found, return 404
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: `User with ID ${userId} not found`
      });
    }
    
    // Update only provided fields (partial update)
    if (name) data.users[userIndex].name = name;
    if (email) data.users[userIndex].email = email;
    if (age) data.users[userIndex].age = parseInt(age);
    
    // Add updated timestamp
    data.users[userIndex].updatedAt = new Date().toISOString();
    
    // Return updated user
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: data.users[userIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error while updating user"
    });
  }
};

// DELETE - Remove user
const deleteUser = (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    // Find user index
    const userIndex = data.users.findIndex(u => u.id === userId);
    
    // If user not found, return 404
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: `User with ID ${userId} not found`
      });
    }
    
    // Remove user from array
    const deletedUser = data.users.splice(userIndex, 1)[0];
    
    // Return success message
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error while deleting user"
    });
  }
};

// Export all controller functions
module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};