import { Schema, model } from 'mongoose'

const teacherSchema = new Schema({
  name: {
    type: String
  },
  lastname: {
    type: String
  },
  cc: {
    type: String,
    unique: true
  },
  category: {
    type: String
  },
  qualificaction: {
    type: String
  },
  seedgroups: [
    { type: String }
  ],
  SMMLV: {
    type: Number
  }

}, {
  timestamps: true,
  versionKey: false
}

)

const teacherModel = model('teacher', teacherSchema)
export default teacherModel
