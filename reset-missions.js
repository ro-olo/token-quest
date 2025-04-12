// Script to reset missions in localStorage to use new data

// Clear the existing missions storage
localStorage.removeItem('tokenquest_mock_missions');

// Force page reload to reinitialize with new mission data
window.location.reload();

console.log('Missions have been reset!');
