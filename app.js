const express = require('express')
const app = express()
const port = 3000

app.get('/',(req,res)=>{
  res.send('build successful')
})

app.listen(port,()=>{
  console.log(`express server is runnning on http://localhost:${port}`)
})