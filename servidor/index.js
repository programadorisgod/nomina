import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import colors from 'colors'

import { findAvailablePort } from './config/port.js'
import { connectDB } from './config/conectDB.js'
import routerTeacher from './src/routes/teacher.js'
const app = express()
const desiredPort = 3000

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.disable('x-powered-by')

app.use(routerTeacher)
connectDB()

findAvailablePort(desiredPort).then(port => {
  app.listen(port, () => console.log(`[Server] server listening in the port ${port}`.magenta))
})
