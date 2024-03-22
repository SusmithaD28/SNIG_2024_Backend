const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://movies:mongodb@cluster0.ona9uuw.mongodb.net/sample_mflix');
const AdminSchema = new mongoose.Schema({
    // Schema definition here
    name: String,
    password: String,
    email: String
});

const UserSchema = new mongoose.Schema({
    // Schema definition here
    name: String,
    password: String,
    email: String,
    subscription: {
        type: String,
        default: null
    }
});

const MovieSchema = new mongoose.Schema({
    // Schema definition here
    title: String,
    plot: String,
    genres: [String],
    runtime: Number,
    // cast: [String],
    // poster: String,
    // fullplot: String,
    // languages: [String],
    // released: String,
    // directors: [String],
    // rated: String,
    // awards: Object,
    // lastupdated: String,
    // year: Number,
    // imdb: Object,
    // countries: [String],
    // type: String,
    // tomatoes: Object,
    // num_mflix_comments: Number
});
const Admin = mongoose.model('Admin', AdminSchema);
const User = mongoose.model('User', UserSchema);
const Movies = mongoose.model('Movies', MovieSchema);
module.exports = {
    Admin,
    User,
    Movies
}
