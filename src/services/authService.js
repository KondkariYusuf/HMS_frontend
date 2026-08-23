/**
 * authService.js
 * A mock authentication service using localStorage to simulate a backend database.
 */

const USERS_KEY = 'hms_mock_users';

/**
 * Helper to get all users from local storage
 */
const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : {};
};

/**
 * Register a new user
 * @param {string} fullName 
 * @param {string} email 
 * @param {string} phone 
 * @param {string} password 
 * @returns {object} { success: boolean, message: string }
 */
export const registerUser = (fullName, email, phone, password) => {
  const users = getUsers();
  
  if (users[email]) {
    return { success: false, message: 'User with this email already exists.' };
  }

  users[email] = {
    fullName,
    email,
    phone,
    password, // Storing in plain text for testing purposes only
  };

  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return { success: true, message: 'Registration successful.' };
};

/**
 * Standard login
 * @param {string} email 
 * @param {string} password 
 * @returns {object} { success: boolean, message: string }
 */
export const loginUser = (email, password) => {
  const users = getUsers();
  const user = users[email];

  if (!user) {
    return { success: false, message: 'User not found.' };
  }

  if (user.password !== password) {
    return { success: false, message: 'Invalid credentials.' };
  }

  return { success: true, message: 'Login successful.' };
};
