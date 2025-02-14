const mongoose = require('mongoose');
const User = require('./models/userModel'); // Import the User model

// MongoDB URI (replace with your actual MongoDB URI)
const MONGODB_URI = 'mongodb+srv://arnav020704:12344321@cluster0.ddhyf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'; // Example URI

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB...');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Sample users to seed (without OTP)
const users = [
  {
    email: 'aarushdua2004@gmail.com',
    name: 'Aarush Dua',
    role: ['CourseInstructor'],
  },
  {
    email: 'bansalarnav1@gmail.com',
    name: 'Arnav',
    role: ['CourseInstructor'],
  },
  {
    email: 'arnav.020704@gmail.com',
    name: 'Arnav',
    role: ['CourseInstructor','FacultyAdvisor'],
  },
  {
    email: 'duaaarush07@gmail.com',
    name: 'Aarush',
    role: ['FacultyAdvisor'],
  },
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('Existing users deleted.');

    // Insert new users
    await User.insertMany(users);
    console.log('New users added.');

    // Close the connection
    mongoose.connection.close();
  } catch (err) {
    console.error('Error seeding database:', err);
    mongoose.connection.close();
  }
};

// Execute the seeding function
seedDatabase();