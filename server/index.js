const express = require('express')
const morgan = require('morgan')
const app = express()
const PORT = 3000
const path = require('path')

app.use(morgan('dev'))

app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use(express.static(path.join(__dirname, '../public')))

app.use("/api", require('./api'))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.use((error,req,res,next) => {
    console.log(error.message)
    res.send(error)
})


const init = async () => {
    try {
      app.listen(PORT, () => {
        console.log(`Listening at http://localhost:${PORT}`);
      });
    } catch (error) {
      console.error('Error starting server:', error);
    }
  };
  
  init();