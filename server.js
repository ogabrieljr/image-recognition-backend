const express = require("express")
const app = express()
app.listen(3000, () => {
  console.log("hello")
})
app.get("", (req, res) => {
  res.send("working")
})

/*
res = working
signin = post = sucess/fail
register = post = user
profile/:userID = GET = user
image = PUT = user

*/