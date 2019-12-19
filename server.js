if(process.env.NODE_ENV !== 'production') {
  require('dotenv').parse()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')

const indexRouter = require('./routes/index') 

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')     //for headers & footers
app.use(expressLayouts)
app.use(express.static('public'))       //for css, js, img

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL)
.then(() => {
  console.log('DB Connected.')
})
.catch(err => {
  console.log('Error Connecting to DB!')
})

app.use('/', indexRouter)

app.listen(process.env.PORT || 3000)