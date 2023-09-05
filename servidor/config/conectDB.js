import mongoose from 'mongoose'
import pc from 'picocolors'
import { DB_URI } from './secretsKey.js'

export const connectDB = async () => {
  try {
    await mongoose.connect(DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    console.log(`${pc.blue('[DataBase]')} connected whit success `)
  } catch (error) {
    console.log(`${pc.yellow('[DataBase]')} ${pc.red('Error:')} ${error}`)
  }
}
