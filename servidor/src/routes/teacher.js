import { Router } from 'express'
import { CreateTeachers, GetTeachers } from '../controllers/teacher.js'
const routerTeacher = Router()

const PATH = '/api/v1/nomina'

routerTeacher.get(`${PATH}`, GetTeachers)
routerTeacher.post(`${PATH}`, CreateTeachers)

export default routerTeacher
