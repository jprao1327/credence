const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Book = require('./models/Book');

const app = express();

mongoose.connect('mongodb://localhost/books', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());

// Create a new book
app.post('/books', (req, res) => {
  const book = new Book(req.body);
  book.save((err, book) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(book);
    }
  });
});

// Get all books
app.get('/books', (req, res) => {
  Book.find().then(books => {
    res.send(books);
  }).catch(err => {
    res.status(500).send(err);
  });
});

// Get a single book
app.get('/books/:id', (req, res) => {
  Book.findById(req.params.id).then(book => {
    if (!book) {
      res.status(404).send({ message: 'Book not found' });
    } else {
      res.send(book);
    }
  }).catch(err => {
    res.status(500).send(err);
  });
});

// Update a book
app.put('/books/:id', (req, res) => {
  Book.findByIdAndUpdate(req.params.id, req.body, { new: true }).then(book => {
    res.send(book);
  }).catch(err => {
    res.status(500).send(err);
  });
});

// Delete a book
app.delete('/books/:id', (req, res) => {
  Book.findByIdAndRemove(req.params.id).then(() => {
    res.send({ message: 'Book deleted successfully' });
  }).catch(err => {
    res.status(500).send(err);
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});