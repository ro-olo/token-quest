// Script to reset rewards in localStorage to use new data

// Clear the existing rewards storage
localStorage.removeItem('tokenquest_mock_rewards');
localStorage.removeItem('tokenquest_rewards');

// Force page reload to reinitialize with new reward data
window.location.reload();

console.log('Rewards have been reset!');
