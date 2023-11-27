import express from 'express';
import User from '../models/users.js';
import Book from '../models/books.js';
import bcrypt from 'bcryptjs';
const router = express.Router();


// Route to handle user registration

router.post('/register', async(req, res) => {
    try {
        const { firstName, lastName, username, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json("User already exists");
        }

        // Hash the password before saving to the database
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user with the hashed password
        const newUser = new User({
            firstName,
            lastName,
            username,
            password: hashedPassword
        });

        // Save the new user to the database
        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch (error) {
        res.status(400).json("Error: " + error.message);
    }
});

// Route to handle user login
router.post('/login', (req, res) => {
    // Handle user login logic here
    const { username, password } = req.body;
    User.findOne({ username }).then((user) => {
        if (user && bcrypt.compareSync(password, user.password)) {
            res.json(user);
        } else {
            res.status(400).json("Invalid username or password");
        }
    }).catch((err) => res.status(400).json("Error:" + err));
});

// Route to get user profile
router.get('/profile', (req, res) => {

    // Handle getting user profile logic here
    const { username } = req.body;
    User.findOne({ username }).then((user) => {
        res.json(user);
    }).catch((err) => res.status(400).json("Error:" + err));
});

// Route to update user profile
router.put('/profile', (req, res) => {
    // Handle updating user profile logic here
    const { username } = req.body;
    const { firstName, lastName } = req.body;
    User.findOneAndUpdate({ username }, { firstName, lastName }).then((user) => {
        res.json(user);
    }).catch((err) => res.status(400).json("Error:" + err));
});

// Route to delete user account
router.delete('/profile', (req, res) => {
    // Handle deleting user account logic here
    const { username } = req.body;
    User.findOneAndDelete({ username }).then((user) => {
        res.json(user);
    }).catch((err) => res.status(400).json("Error:" + err));
});

// Route to get all books
router.get('/books', (req, res) => {
    // Handle getting all books logic here
    Book.find().then((books) => {
        res.json(books);
    }).catch((err) => res.status(400).json("Error:" + err));
});

// Route to get a specific book by ID
router.get('/books/:id', (req, res) => {
    // Handle getting a specific book by ID logic here
    const { id } = req.params;
    Book.findById(id).then((book) => {
        res.json(book);
    }).catch((err) => res.status(400).json("Error:" + err));
});
//route to add books 

router.post('/books', (req, res) => {
    // Handle adding a new book logic here
    const { title, author, description } = req.body;
    const book = new Book({ title, author, description });
    book.save().then(() => res.json("Book added")).catch((err) => res.status(400).json("Error:" + err));
});

export default router;