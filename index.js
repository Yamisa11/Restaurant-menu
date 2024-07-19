const express = require('express');
const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const { marked } = require('marked');
const exphbs = require('express-handlebars');
const fetch = require('node-fetch');

const app = express();
const port = 8000; 

app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

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

app.get('/', (req, res) => {
  const restaurant = 'PizzaPalace';  
  const apiUrl = `http://localhost:${port}/api/menu?restaurant=${restaurant}`;

  // Fetch the JSON data from the API
  fetch(apiUrl)
    .then(response => response.json())
    .then(menuData => {
      res.render('menu', { menu: menuData });
    })
    .catch(error => {
      console.error('Error fetching menu data:', error);
      res.status(500).send('Error fetching menu data');
    });
});

app.get('/menu', (req, res) => {
    const restaurant = req.query.restaurant;
    if (!restaurant) {
      return res.status(400).send('Restaurant name is required');
    }
  
    const filePath = path.join(__dirname, 'menu', `${restaurant}.md`);
  
    
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return res.status(500).send('Error reading markdown file');
      }
  
      try {
        const htmlContent = marked.parse(data); 
        res.send(htmlContent);
      } catch (parseError) {
        res.status(500).send('Error parsing markdown file');
      }
    });
  });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

