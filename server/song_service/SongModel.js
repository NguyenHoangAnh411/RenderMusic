const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const songSchema = new Schema({
  author: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  song_path: {
    type: String,
    required: true
  },
  image_path: {
    type: String,
    required: true
  },
  lyric: {
    type: String, // hoặc kiểu dữ liệu phù hợp với nội dung của lời bài hát
    required: true
  }
});

const Song = mongoose.model("Song", songSchema);
module.exports = Song;
