const mongoose = require('mongoose');

const urPlaylistSchema = new mongoose.Schema({
    name: {
        type: String,
        default: 'My Playlist'
    },
    description: {
        type: String,
        default: ''
    },
    image_path: {
        type: String,
        required: false
    },
    songs: [{
        song: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Song'
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

urPlaylistSchema.pre('save', async function(next) {
    try {
        if (!this.isNew) {
            return next();
        }

        const count = await this.constructor.countDocuments();

        this.name = `My Playlist #${count + 1}`;

        next();
    } catch (error) {
        next(error);
    }
});

const UrPlaylist = mongoose.model('UrPlaylist', urPlaylistSchema);

module.exports = UrPlaylist;
