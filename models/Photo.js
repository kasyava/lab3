const mongoose = require ("mongoose");
const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    }
});

const Photo = mongoose.model('Photo', PhotoSchema);

module.exports = Photo;