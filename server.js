const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

const app = express();
dotenv.config();

// Database connection object
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the database
db.connect((err) => {
  if (err) {
    return console.error('Error connecting to the database:', err);
  
  }
  console.log('Connected to the database');
});

//question 1 
app.get('/get-patients', (req, res) => {
  const getpatients = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';

  db.query(getpatients, (err, results) => {
    if (err) {
      return res.status(500).send('Database query failed')
    }
    
    res.status(200).send(results);
  });
});

// question 2
app.get('/get-providers', (req, res) => {
  const getProviders = 'SELECT first_name, last_name, provider_specialty FROM providers';

  db.query(getProviders, (err, results) => {
    if (err) {
      return res.status(500).send('Database query failed');
    }
    res.status(200).send(results);
  });
});


// question 3 Get patients by their first name
app.get('/get-patients-by-firstname', (req, res) => {
  const { first_name } = req.query;

  if (!first_name) {
    return res.status(400).send('Please provide a first name');
  }

  const getPatientsByFirstName = 'SELECT * FROM patients WHERE first_name = ?'; 

  db.query(getPatientsByFirstName, [first_name], (err, results) => {
    if (err) {
      console.error('Database query failed:', err); 
      return res.status(500).send('Database query failed: ' + err.message); 
    }

    if (results.length === 0) {
      return res.status(404).send('No patients found with that first name');
    }

    res.status(200).send(results);
  });
});



//question 4 retrieve all providers by their specialty
app.get('/get-providers-by-specialty', (req, res) => {
  const { specialty } = req.query;  

  if (!specialty) {
    return res.status(400).send('Please provide a specialty');
  }

  const getProvidersBySpecialty = 'SELECT * FROM providers WHERE provider_specialty = ?'; 

  db.query(getProvidersBySpecialty, [specialty], (err, results) => {
    if (err) {
      console.error('Database query failed:', err);
      return res.status(500).send('Database query failed: ' + err.message);  
    }

    if (results.length === 0) {
      return res.status(404).send('No providers found with that specialty');
    }

    res.status(200).send(results);  
  });
});



// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


