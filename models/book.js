const mongoose = require('mongoose')
const path = require('path')

const coverImageBasePath = 'uploads/bookCovers'   //would be inside public folder. path defined in bookRouter

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  publishDate: {
    type: Date,
    required: true
  },
  pageCount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  coverImageName: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Author'
  }
})

//when we call book.coverImagePath, this get function is called
bookSchema.virtual('coverImagePath').get(function() {
  //using function instead of '()=>' so as to access 'this' variable
  if(this.coverImageName != null) {
    return path.join('/', coverImageBasePath, this.coverImageName)    // '/' for base public folder
  }
})

module.exports = mongoose.model('Book', bookSchema)
module.exports.coverImageBasePath = coverImageBasePath