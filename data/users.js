const fs = require('fs');
const path = require('path');

// Path to JSON file where data will be saved
const DATA_FILE = path.join(__dirname, 'users.json');

/*
 * DATA PERSISTENCE:
 * - Data is stored in users.json file
 * - When server starts, it loads data from the file
 * - When data changes (POST/PUT/DELETE), it saves to the file
 * - This way, your data persists even after server restarts!
 */

// Initial default users (used only if users.json doesn't exist)
const defaultUsers = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    age: 25,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    age: 30,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie@example.com",
    age: 22,
    createdAt: new Date().toISOString()
  }
];

// Load users from JSON file or use defaults
let users = [];
let nextId = 4;

/*
 * LOAD DATA FROM FILE
 * This function runs when the server starts
 * It reads users.json and loads the data into memory
 */
const loadData = () => {
  try {
    // Check if users.json file exists
    if (fs.existsSync(DATA_FILE)) {
      // Read the file content
      const fileData = fs.readFileSync(DATA_FILE, 'utf8');
      
      // Parse JSON string to JavaScript object
      const parsedData = JSON.parse(fileData);
      
      users = parsedData.users || defaultUsers;
      nextId = parsedData.nextId || 4;
      
      console.log('✅ Data loaded from users.json');
    } else {
      // File doesn't exist, use default data
      users = defaultUsers;
      nextId = 4;
      
      // Save default data to create the file
      saveData();
      console.log('📝 Created new users.json with default data');
    }
  } catch (error) {
    console.error('❌ Error loading data:', error.message);
    // If there's an error, use default data
    users = defaultUsers;
    nextId = 4;
  }
};

/*
 * SAVE DATA TO FILE
 * This function saves current users array to users.json
 * Called after POST, PUT, and DELETE operations
 */
const saveData = () => {
  try {
    // Create object with users and nextId
    const dataToSave = {
      users,
      nextId,
      lastUpdated: new Date().toISOString()
    };
    
    // Convert JavaScript object to JSON string (with pretty formatting)
    const jsonString = JSON.stringify(dataToSave, null, 2);
    
    // Write to file
    fs.writeFileSync(DATA_FILE, jsonString, 'utf8');
    
    console.log('💾 Data saved to users.json');
  } catch (error) {
    console.error('❌ Error saving data:', error.message);
  }
};

// Load data when this module is first imported
loadData();

module.exports = {
  users,
  getNextId: () => nextId++,
  saveData  // Export saveData function so controllers can call it
};