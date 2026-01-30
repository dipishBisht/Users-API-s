const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'users.json');

const defaultUsers = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice@example.com",
    age: 25,
    role: "developer",
    city: "New York",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob@example.com",
    age: 30,
    role: "designer",
    city: "San Francisco",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie@example.com",
    age: 22,
    role: "developer",
    city: "Austin",
    isActive: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 4,
    name: "Diana Prince",
    email: "diana@example.com",
    age: 28,
    role: "manager",
    city: "New York",
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 5,
    name: "Eve Adams",
    email: "eve@example.com",
    age: 35,
    role: "developer",
    city: "Seattle",
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

let users = [];
let nextId = 6;

const loadData = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const fileData = fs.readFileSync(DATA_FILE, 'utf8');
      const parsedData = JSON.parse(fileData);
      users = parsedData.users || defaultUsers;
      nextId = parsedData.nextId || 6;
      console.log('✅ Data loaded from users.json');
    } else {
      users = defaultUsers;
      nextId = 6;
      saveData();
      console.log('📝 Created new users.json with default data');
    }
  } catch (error) {
    console.error('❌ Error loading data:', error.message);
    users = defaultUsers;
    nextId = 6;
  }
};

const saveData = () => {
  try {
    const dataToSave = {
      users,
      nextId,
      lastUpdated: new Date().toISOString()
    };
    const jsonString = JSON.stringify(dataToSave, null, 2);
    fs.writeFileSync(DATA_FILE, jsonString, 'utf8');
    console.log('💾 Data saved to users.json');
  } catch (error) {
    console.error('❌ Error saving data:', error.message);
  }
};

loadData();

module.exports = {
  users,
  getNextId: () => nextId++,
  saveData
};