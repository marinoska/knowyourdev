// Test script for the updated validation in the controller
const axios = require('axios');

async function testUpdateProjectValidation() {
  const API_URL = 'http://localhost:3000/api'; // Adjust this to your API URL
  const projectId = '60d21b4667d0d8992e610c85'; // Replace with a valid project ID

  console.log('Testing update project validation');

  // Test 1: Valid update
  console.log('\nTest 1: Valid update');
  try {
    const response = await axios.patch(`${API_URL}/projects/${projectId}`, {
      name: 'Updated Project Name',
      settings: {
        baselineJobDuration: 2,
        techFocus: ['BE', 'FE'], // Valid techFocus values
      }
    });
    console.log('Success:', response.status, response.statusText);
  } catch (error) {
    console.error('Error:', error.response?.status, error.response?.data || error.message);
  }

  // Test 2: Invalid techFocus
  console.log('\nTest 2: Invalid techFocus');
  try {
    const response = await axios.patch(`${API_URL}/projects/${projectId}`, {
      settings: {
        techFocus: ['INVALID'], // Invalid techFocus value
      }
    });
    console.log('Unexpected success:', response.status, response.statusText);
  } catch (error) {
    console.log('Expected error:', error.response?.status, error.response?.data || error.message);
  }

  // Test 3: Invalid technology reference
  console.log('\nTest 3: Invalid technology reference');
  try {
    const response = await axios.patch(`${API_URL}/projects/${projectId}`, {
      settings: {
        technologies: [{ ref: '60d21b4667d0d8992e610c85' }], // Replace with an invalid tech ID
      }
    });
    console.log('Unexpected success:', response.status, response.statusText);
  } catch (error) {
    console.log('Expected error:', error.response?.status, error.response?.data || error.message);
  }

  console.log('\nAll tests completed');
}

testUpdateProjectValidation();