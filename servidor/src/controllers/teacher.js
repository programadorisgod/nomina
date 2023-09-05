import teacherModel from '../models/teachers.js'

export const GetTeachers = async (req, res) => {
  try {
    const teachers = await teacherModel.find({})
    if (!teachers) {
      res.status(404).send('teachers not found')
      return
    }
    res.status(200).json(teachers)
  } catch (err) {
    res.status(500).json({ msg: 'Internal server error' })
  }
}

export const CreateTeachers = async (req, res) => {
  const teacher = req.body
  try {
    console.log(teacher)
    const teacherCreated = await teacherModel.create(teacher)
    res.status(200).json('Teacher Created')
  } catch (error) {
    res.status(500).json({ msg: 'Internal server error' })
  }
}
