// Mock Authentication Service
import { v4 as uuidv4 } from 'uuid';

// Mock local storage for users
const USERS_STORAGE_KEY = 'tokenquest_mock_users';
const AUTH_USER_KEY = 'tokenquest_user';

// Helper functions
const getStoredUsers = () => {
  const usersJson = localStorage.getItem(USERS_STORAGE_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
};

const getCurrentUser = () => {
  const userJson = localStorage.getItem(AUTH_USER_KEY);
  return userJson ? JSON.parse(userJson) : null;
};

const saveCurrentUser = (user) => {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

const clearCurrentUser = () => {
  localStorage.removeItem(AUTH_USER_KEY);
};

// Initialize mock database with default users if needed
const initMockDatabase = () => {
  const users = getStoredUsers();
  if (users.length === 0) {
    // Create a default test user
    const defaultUser = {
      uid: uuidv4(),
      email: 'avventuriero@example.com',
      password: 'password123', // Note: In a real app, passwords would be hashed
      displayName: 'Avventuriero Coraggioso',
      energy: 10,
      totalEnergyEarned: 10,
      completedMissions: 0,
      redeemedRewards: 0,
      registrationDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    saveUsers([defaultUser]);
  }
};

// Mock auth functions that mimic Firebase's behavior
export const registerUser = async (email, password, displayName) => {
  // Check if email is already in use
  const users = getStoredUsers();
  if (users.find(u => u.email === email)) {
    throw new Error('La Pergamena dell\'Email è già stata rivendicata da un altro avventuriero!');
  }
  
  // Create new user
  const newUser = {
    uid: uuidv4(),
    email,
    password, // In a real app, this would be hashed
    displayName,
    energy: 0, // Changed from 10 to 0 as requested
    totalEnergyEarned: 0, // Changed from 10 to 0 for consistency
    completedMissions: 0,
    redeemedRewards: 0,
    registrationDate: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };
  
  // Store user
  users.push(newUser);
  saveUsers(users);
  
  // Set as current user
  const { password: _, ...userWithoutPassword } = newUser; // Remove password from returned user
  saveCurrentUser(userWithoutPassword);
  
  return userWithoutPassword;
};

export const loginUser = async (email, password) => {
  const users = getStoredUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('La Chiave Arcana (email o password) non è corretta!');
  }
  
  // Update last login
  user.lastLogin = new Date().toISOString();
  saveUsers(users.map(u => u.uid === user.uid ? user : u));
  
  // Set as current user
  const { password: _, ...userWithoutPassword } = user; // Remove password from returned user
  saveCurrentUser(userWithoutPassword);
  
  return userWithoutPassword;
};

export const logoutUser = async () => {
  clearCurrentUser();
  return true;
};

export const getUserData = async (userId) => {
  const users = getStoredUsers();
  const user = users.find(u => u.uid === userId);
  
  if (!user) {
    throw new Error('L\'Avventuriero non è stato trovato nei Registri Magici!');
  }
  
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const updateUserData = async (userId, data) => {
  const users = getStoredUsers();
  const userIndex = users.findIndex(u => u.uid === userId);
  
  if (userIndex === -1) {
    throw new Error('L\'Avventuriero non è stato trovato nei Registri Magici!');
  }
  
  // Update user data
  const updatedUser = { ...users[userIndex], ...data };
  users[userIndex] = updatedUser;
  saveUsers(users);
  
  // Update current user if this is the current user
  const currentUser = getCurrentUser();
  if (currentUser && currentUser.uid === userId) {
    const { password: _, ...userWithoutPassword } = updatedUser;
    saveCurrentUser(userWithoutPassword);
  }
  
  return data;
};

export const resetPassword = async (email) => {
  const users = getStoredUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    throw new Error('Nessun Avventuriero trovato con questa Pergamena dell\'Email!');
  }
  
  // In a real app, this would send an email. Here we just log it.
  console.log(`Password reset request for ${email}. In a real app, an email would be sent.`);
  return true;
};

// Mock auth state change observer
export const setupAuthObserver = (callback) => {
  // Check if user is logged in on initial load
  const user = getCurrentUser();
  callback(user);
  
  // Return a function to cancel the subscription
  return () => {
    // Nothing to do in our mock version
  };
};

// Initialize mock database
initMockDatabase();
