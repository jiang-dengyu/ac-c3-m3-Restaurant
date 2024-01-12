const express = require('express')
const app = express()
const port = 3000

app.get('/',(req,res)=>{
  res.redirect('/restaurants')
})
app.get('/restaurants',(req,res)=>{
  res.send('build successful')
})

app.get('/restaurant/:id',(req,res)=>{
  const id = req.params.id 
  res.send(`restaurant number : ${id}`)
})

app.listen(port,()=>{
  console.log(`express server is runnning on http://localhost:${port}`)
})
