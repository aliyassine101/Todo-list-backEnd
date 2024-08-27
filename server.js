const express = require('express')
const app = express()
const { readDataFromExcelFile,writetoExcel,removeRowById ,updateNameById} = require('./services/excelManipulation.services')
app.use(express.json())
var cors = require('cors')
app.use(cors())

app.get('/getAllItems', async function (req, res) {
  const result = await readDataFromExcelFile('todolist.xlsx')
  console.log('result : ', result)
  res.send(result)

})


app.post('/AddTodo',  function (req, res) {
  const {item,priority}=req.body;
  console.log('result : ', {item,priority})
  res.send({item,priority})
  writetoExcel(item,priority)
})



app.post('/DeleteTodo',  async function (req, res) {
  const {filepath,itemColomn,item}=req.body;
  console.log('removed : ', {filepath,itemColomn,item});
  const result =await removeRowById(filepath,itemColomn,item);
  console.log(result)
  res.send({result});

})


app.post('/UpdateTodo',  async function (req, res) {
   const {filepath,itemColomn,item,newitem,newpriority}=req.body;
  const result =await updateNameById(filepath,itemColomn,item,newitem,newpriority);
  console.log(result)
  res.send({result});

})


app.listen(3000)