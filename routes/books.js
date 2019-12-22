const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')

const fs = require('fs')  //to manage file-system
//to handle files upload
const path = require('path')
const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['mage/jpeg', 'image/png', 'image/gif']
const multer = require('multer')

const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))    //null for error, second arg to accept file or not (T/F)
  }
})

//All Books
router.get('/', async (req, res) => {
  let query = Book.find()       //store as query object to apply queries later

  if(req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if(req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore)
  }
  if(req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter)
  }

  try {
    const books = await query.exec()
    res.render('books/index', {
      books: books,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

//New Book
router.get('/new', async (req, res) => {
  renderNewPage(res, new Book())
})

//Create New Book
router.post('/', upload.single('cover'), async (req, res) => {    //single=>one file uploaded. 'cover'=>formFieldName for file
  const fileName = req.file != null ? req.file.filename : null    //req.file auto added by multer library
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),   //because returned as string
    pageCount: req.body.pageCount,
    coverImageName: fileName,
    description: req.body.description
  })

  try {
    const newBook = await book.save()
    res.redirect('books')
  } catch {
    //multer saves cover image even if error, so to delete that use this:
    if(book.coverImageName != null) {
      removeBookCover(book.coverImageName)
    }
    renderNewPage(res, book, true)
  }
})

function removeBookCover(fileName) {
  fs.unlink(path.join(uploadPath, fileName), err => {
    if(err) {
      console.log(err)
    }
  })
}

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({})
    const params = {
      authors: authors,
      book: book
    }

    if(hasError) {
      params.errorMessage = 'Error Creating Book'
    }

    res.render('books/new', params)

  } catch {
    res.redirect('books')
  }
}

module.exports = router