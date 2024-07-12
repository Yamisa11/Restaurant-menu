const express = require('express');
const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const app = express();
const port = 8000;  // Updated port

// API endpoint to get menu from a YAML file
app.get('/api/menu', (req, res) => {
  const restaurant = req.query.restaurant;
  if (!restaurant) {
    return res.status(400).json({ error: 'Restaurant name is required' });
  }

  const filePath = path.join(__dirname, `${restaurant}.yaml`);

  // Read the YAML file from disk
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading YAML file' });
    }

    try {
      const jsonData = yaml.parse(data);
      res.json(jsonData);
    } catch (parseError) {
      res.status(500).json({ error: 'Error parsing YAML file' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

