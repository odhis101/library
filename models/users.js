import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    // Existing fields
    firstName: String,
    lastName: String,
    username: String,
    password: String,

    // New field for borrowed books
    borrowedBooks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
    }, ],
});

const User = mongoose.model('User', userSchema);

export default User;