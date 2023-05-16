     const express = require ('express')
     const app = express()
     const port = process.env.PORT || 3000

    require('./db/mongoose')
    
    app.use(express.json())

    const userRouter = require("./router/user")
    const taskRouter = require('./router/task')

    app.use(userRouter)
    app.use(taskRouter)

    app.listen( port , () => {
        console.log("The connection succeeded")
    })