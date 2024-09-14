const express = require('express')
const app = express()
const path = require('path')
const port = 8001
const attendanceRoutes = require('./routes/attendance')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/attendance', attendanceRoutes)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'))
})

app.listen(port,'0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}/`)
    console.log(`Server 2 running at http://localhost:${port}/`)
})
