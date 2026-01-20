let users = [
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

// Counter for generating new user IDs
let nextId = 4;

module.exports = {
  users,
  getNextId: () => nextId++
};