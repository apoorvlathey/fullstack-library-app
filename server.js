if(process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const indexRouter = require('./routes/index')
const authorsRouter = require('./routes/authors')
const booksRouter = require('./routes/books')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')     //for headers & footers
app.use(expressLayouts)
app.use(express.static('public'))       //for css, js, img
app.use(bodyParser.urlencoded({limit: '10mb', extended: false}))    //limit increase so can upload files
app.use(methodOverride('_method'))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
.then(() => {
  console.log('DB Connected.')
})
.catch(err => {
  console.log('Error Connecting to DB!')
})

app.use('/', indexRouter)
app.use('/authors', authorsRouter)
app.use('/books', booksRouter)

app.listen(process.env.PORT || 3000)