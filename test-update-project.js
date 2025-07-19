// Test script for the updated patch function
const mongoose = require('mongoose');
const { ProjectModel } = require('./apps/api/src/models/project.model.js');

async function testUpdateProject() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/kyd', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');
    
    // Get a project ID to test with
    const projects = await ProjectModel.find().limit(1);
    if (projects.length === 0) {
      console.error('No projects found to test with');
      return;
    }
    
    const projectId = projects[0]._id;
    console.log(`Testing with project ID: ${projectId}`);
    
    // Test updating only the name
    console.log('\nTest 1: Update only the name');
    const result1 = await ProjectModel.patch(projectId, {
      name: 'Updated Project Name',
    });
    console.log('Result:', result1 ? 'Success' : 'Failed');
    
    // Test updating a specific setting
    console.log('\nTest 2: Update a specific setting');
    const result2 = await ProjectModel.patch(projectId, {
      settings: {
        baselineJobDuration: 2,
      },
    });
    console.log('Result:', result2 ? 'Success' : 'Failed');
    
    // Test updating techFocus with valid values
    console.log('\nTest 3: Update techFocus with valid values');
    const result3 = await ProjectModel.patch(projectId, {
      settings: {
        techFocus: ['BE', 'FE'],
      },
    });
    console.log('Result:', result3 ? 'Success' : 'Failed');
    
    // Test updating techFocus with invalid values
    console.log('\nTest 4: Update techFocus with invalid values');
    try {
      const result4 = await ProjectModel.patch(projectId, {
        settings: {
          techFocus: ['INVALID'],
        },
      });
      console.log('Result: Failed - Should have thrown an error');
    } catch (error) {
      console.log('Result: Success - Error thrown as expected:', error.message);
    }
    
    // Test updating technologies with valid references
    // Note: This test requires valid technology IDs from your TechList collection
    console.log('\nTest 5: Update technologies with valid references');
    // Get some valid tech IDs from your database
    const techList = await mongoose.model('TechList').find().limit(2);
    if (techList.length > 0) {
      try {
        const result5 = await ProjectModel.patch(projectId, {
          settings: {
            technologies: techList.map(tech => ({ ref: tech._id.toString() })),
          },
        });
        console.log('Result:', result5 ? 'Success' : 'Failed');
      } catch (error) {
        console.log('Error:', error.message);
      }
    } else {
      console.log('Skipping - No tech items found in the database');
    }
    
    // Test updating technologies with invalid references
    console.log('\nTest 6: Update technologies with invalid references');
    try {
      const result6 = await ProjectModel.patch(projectId, {
        settings: {
          technologies: [{ ref: '60d21b4667d0d8992e610c85' }], // Invalid ID
        },
      });
      console.log('Result: Failed - Should have thrown an error');
    } catch (error) {
      console.log('Result: Success - Error thrown as expected:', error.message);
    }
    
    console.log('\nAll tests completed');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

testUpdateProject();