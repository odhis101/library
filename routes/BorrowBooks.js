// routes/borrowBooks.js
import express from 'express';
import User from '../models/users.js';
import Book from '../models/books.js';

const router = express.Router();

// Route to handle user borrowing a book
router.post('/borrow/:username/:bookId', async(req, res) => {
    const { username, bookId } = req.params;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json("User not found");
        }

        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json("Book not found");
        }

        // Add the book to the user's borrowedBooks array
        user.borrowedBooks.push(book);
        await user.save();

        res.json(`Book borrowed: ${book.title}`);
    } catch (err) {
        res.status(400).json("Error:" + err.message);
    }
});

// Route to return a book
router.post('/return/:username/:bookId', async(req, res) => {
    const { username, bookId } = req.params;

    try {
        const user = await User.findOne({ username });

        if (!user || user.borrowedBooks.length === 0) {
            return res.status(404).json("User not found or user has not borrowed any books");
        }

        const bookIndex = user.borrowedBooks.findIndex(book => book._id == bookId);

        if (bookIndex > -1) {
            // Remove the book from the user's borrowedBooks array
            user.borrowedBooks.splice(bookIndex, 1);
            await user.save();

            res.json(`Book returned: ${bookId}`);
        } else {
            res.status(404).json("Book not found in user's borrowed books");
        }
    } catch (err) {
        res.status(400).json("Error:" + err.message);
    }
});

// Route to view borrowed books
router.get('/borrowed/:username', async(req, res) => {
    const { username } = req.params;

    try {
        const user = await User.findOne({ username });

        if (!user || user.borrowedBooks.length === 0) {
            return res.status(404).json("User not found or user has not borrowed any books");
        }

        res.json(user.borrowedBooks);
    } catch (err) {
        res.status(400).json("Error:" + err.message);
    }
});

export default router;