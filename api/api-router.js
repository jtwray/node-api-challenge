const express = require('express')
const logger= require('./logger-middleware')



const projectsRouter = require('./projects/projectsRouter.js')
const actionsRouter = require('./actions/actionsRouter.js')



const server=express();
server.use(logger)
server.use(express.json())

server.use('/projects',projectsRouter)
server.use('/actions',actionsRouter)

server.get('/',(req,res)=>{
    res.send(`<h2>server is running on port </h2>`)
})


module.exports = server