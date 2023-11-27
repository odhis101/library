import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    description: String,

    // New field to track whether the book is borrowed
    isBorrowed: {
        type: Boolean,
        default: false,
    },
});

const Book = mongoose.model('Book', bookSchema);

export default Book;