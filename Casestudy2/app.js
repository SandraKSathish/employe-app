const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Connect to MongoDB Atlas database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Employee schema
const EmployeeSchema = new mongoose.Schema({
  name: String,
  location: String,
  position: String,
  salary: Number,
});

const Employee = mongoose.model('Employee', EmployeeSchema);

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/dist/FrontEnd')));

// API routes
// Get all employees
app.get('/api/employeelist', (req, res) => {
  Employee.find((err, employees) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(employees);
    }
  });
});

// Get single employee by id
app.get('/api/employeelist/:id', (req, res) => {
  Employee.findById(req.params.id, (err, employee) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(employee);
    }
  });
});

// Add new employee
app.post('/api/employeelist', (req, res) => {
  const employee = new Employee(req.body);

  employee.save((err) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(employee);
    }
  });
});

// Update employee by id
app.put('/api/employeelist/:id', (req, res) => {
  Employee.findById(req.params.id, (err, employee) => {
    if (err) {
      res.status(500).send(err);
    } else {
      employee.name = req.body.name || employee.name;
      employee.location = req.body.location || employee.location;
      employee.position = req.body.position || employee.position;
      employee.salary = req.body.salary || employee.salary;

      employee.save((err) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.send(employee);
        }
      });
    }
  });
});

// Delete employee by id
app.delete('/api/employeelist/:id', (req, res) => {
  Employee.findByIdAndRemove(req.params.id, (err, employee) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(employee);
    }
  });
});

// Serve Frontend
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/FrontEnd/index.html'));
});

// Start server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
