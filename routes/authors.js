const express = require('express')
const router = express.Router()
const Author = require('../models/author')

//All Authors
router.get('/', async (req, res) => {
  let searchOptions = {}
  if(req.query.name !== null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i')    //i for case-insensitive. RegExp to match partial string as well
  }
  try {
    const authors = await Author.find(searchOptions)
    res.render('authors/index', {
      authors: authors,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

//New Author
router.get('/new', (req, res) => {
  res.render('authors/new', { author: new Author() })
})

//Create New Author
router.post('/', async (req, res) => {
  
  const author = new Author({
    name: req.body.name         //explicitly assigning to name, so user can't accidently set id
  })

  try {
    const newAuthor = await author.save()
    
    res.redirect('authors')
  } catch {
    res.render('authors/new', {
      author: author,
      errorMessage: 'Error Creating Author'
    })
  }
})

module.exports = router