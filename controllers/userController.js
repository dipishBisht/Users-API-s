const data = require('../data/users');

/*
 * GET ALL USERS WITH ADVANCED FEATURES
 * Supports: Filtering, Sorting, Pagination, Field Selection
 */
const getAllUsers = (req, res) => {
  try {
    /*
     * QUERY PARAMETERS EXPLANATION:
     * Query params come after '?' in URL
     * Example: /api/users?role=developer&age=25&sort=name&page=1
     * 
     * Access them via: req.query.paramName
     */

    let filteredUsers = [...data.users]; // Create a copy

    // ========== FILTERING ==========
    // Filter by role: ?role=developer
    if (req.query.role) {
      filteredUsers = filteredUsers.filter(u => 
        u.role.toLowerCase() === req.query.role.toLowerCase()
      );
    }

    // Filter by city: ?city=New York
    if (req.query.city) {
      filteredUsers = filteredUsers.filter(u => 
        u.city.toLowerCase() === req.query.city.toLowerCase()
      );
    }

    // Filter by active status: ?isActive=true
    if (req.query.isActive !== undefined) {
      const isActive = req.query.isActive === 'true';
      filteredUsers = filteredUsers.filter(u => u.isActive === isActive);
    }

    // Filter by minimum age: ?minAge=25
    if (req.query.minAge) {
      const minAge = parseInt(req.query.minAge);
      filteredUsers = filteredUsers.filter(u => u.age >= minAge);
    }

    // Filter by maximum age: ?maxAge=30
    if (req.query.maxAge) {
      const maxAge = parseInt(req.query.maxAge);
      filteredUsers = filteredUsers.filter(u => u.age <= maxAge);
    }

    // Search by name (partial match): ?search=alice
    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase();
      filteredUsers = filteredUsers.filter(u => 
        u.name.toLowerCase().includes(searchTerm) ||
        u.email.toLowerCase().includes(searchTerm)
      );
    }

    // ========== SORTING ==========
    /*
     * Sort by field: ?sort=name or ?sort=-age (- for descending)
     * Examples:
     * - ?sort=age (ascending)
     * - ?sort=-age (descending)
     */
    if (req.query.sort) {
      const sortField = req.query.sort.startsWith('-') 
        ? req.query.sort.substring(1) 
        : req.query.sort;
      const sortOrder = req.query.sort.startsWith('-') ? -1 : 1;

      filteredUsers.sort((a, b) => {
        if (a[sortField] < b[sortField]) return -1 * sortOrder;
        if (a[sortField] > b[sortField]) return 1 * sortOrder;
        return 0;
      });
    }

    // ========== PAGINATION ==========
    /*
     * Pagination: ?page=1&limit=10
     * - page: Which page to return (default: 1)
     * - limit: Number of items per page (default: 10)
     */
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const totalResults = filteredUsers.length;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    // ========== FIELD SELECTION ==========
    /*
     * Select specific fields: ?fields=name,email,age
     * Returns only the specified fields
     */
    let finalUsers = paginatedUsers;
    if (req.query.fields) {
      const fields = req.query.fields.split(',');
      finalUsers = paginatedUsers.map(user => {
        const selected = { id: user.id }; // Always include ID
        fields.forEach(field => {
          if (user[field] !== undefined) {
            selected[field] = user[field];
          }
        });
        return selected;
      });
    }

    // Build response with pagination metadata
    const response = {
      success: true,
      count: finalUsers.length,
      totalResults: totalResults,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalResults / limit),
        hasNextPage: endIndex < totalResults,
        hasPrevPage: page > 1
      },
      data: finalUsers
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error while fetching users",
      message: error.message
    });
  }
};

// GET single user by ID
const getUserById = (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = data.users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: `User with ID ${userId} not found`
      });
    }
    
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
    const { name, email, age, role, city, isActive } = req.body;
    
    // Enhanced validation
    if (!name || !email || !age) {
      return res.status(400).json({
        success: false,
        error: "Please provide name, email, and age (required fields)"
      });
    }

    // Email validation (basic)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address"
      });
    }

    // Age validation
    if (age < 18 || age > 100) {
      return res.status(400).json({
        success: false,
        error: "Age must be between 18 and 100"
      });
    }
    
    const emailExists = data.users.find(u => u.email === email);
    if (emailExists) {
      return res.status(400).json({
        success: false,
        error: "Email already in use"
      });
    }
    
    const newUser = {
      id: data.getNextId(),
      name,
      email,
      age: parseInt(age),
      role: role || "user", // Default role
      city: city || "Unknown",
      isActive: isActive !== undefined ? isActive : true,
      createdAt: new Date().toISOString()
    };
    
    data.users.push(newUser);
    data.saveData();
    
    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error while creating user",
      message: error.message
    });
  }
};

// PUT - Update existing user (full update)
const updateUser = (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, email, age, role, city, isActive } = req.body;
    
    const userIndex = data.users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: `User with ID ${userId} not found`
      });
    }

    // Check if email is being changed and if it's already in use
    if (email && email !== data.users[userIndex].email) {
      const emailExists = data.users.find(u => u.email === email);
      if (emailExists) {
        return res.status(400).json({
          success: false,
          error: "Email already in use"
        });
      }
    }
    
    // Update fields
    if (name) data.users[userIndex].name = name;
    if (email) data.users[userIndex].email = email;
    if (age) data.users[userIndex].age = parseInt(age);
    if (role) data.users[userIndex].role = role;
    if (city) data.users[userIndex].city = city;
    if (isActive !== undefined) data.users[userIndex].isActive = isActive;
    
    data.users[userIndex].updatedAt = new Date().toISOString();
    data.saveData();
    
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: data.users[userIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error while updating user",
      message: error.message
    });
  }
};

// PATCH - Partial update (new endpoint)
const patchUser = (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const updates = req.body;
    
    const userIndex = data.users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: `User with ID ${userId} not found`
      });
    }

    // Apply only the fields that were sent
    Object.keys(updates).forEach(key => {
      if (key !== 'id' && key !== 'createdAt') { // Don't allow updating these
        data.users[userIndex][key] = updates[key];
      }
    });
    
    data.users[userIndex].updatedAt = new Date().toISOString();
    data.saveData();
    
    res.status(200).json({
      success: true,
      message: "User partially updated successfully",
      data: data.users[userIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error while updating user",
      message: error.message
    });
  }
};

// DELETE - Remove user
const deleteUser = (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const userIndex = data.users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({
        success: false,
        error: `User with ID ${userId} not found`
      });
    }
    
    const deletedUser = data.users.splice(userIndex, 1)[0];
    data.saveData();
    
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: deletedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error while deleting user",
      message: error.message
    });
  }
};

// GET user statistics
const getUserStats = (req, res) => {
  try {
    const stats = {
      total: data.users.length,
      active: data.users.filter(u => u.isActive).length,
      inactive: data.users.filter(u => !u.isActive).length,
      averageAge: Math.round(
        data.users.reduce((sum, u) => sum + u.age, 0) / data.users.length
      ),
      byRole: {},
      byCity: {}
    };

    // Count by role
    data.users.forEach(u => {
      stats.byRole[u.role] = (stats.byRole[u.role] || 0) + 1;
    });

    // Count by city
    data.users.forEach(u => {
      stats.byCity[u.city] = (stats.byCity[u.city] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Server error while fetching statistics"
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  patchUser,
  deleteUser,
  getUserStats
};