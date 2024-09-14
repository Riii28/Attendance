const express = require('express')
const pool = require('../db/index')
const router = express.Router()

router.post('/add', async (req, res) => {
    const { studentName, studentCode, studentGrade, status } = req.body

    try {
        const tableName = `attendance_records_${studentGrade.toLowerCase()}`
        const date = new Date().toISOString().slice(0, 10)
    
        const studentResult = await pool.query(
            'SELECT * FROM students WHERE student_name = $1 AND student_code = $2 AND student_grade = $3',
            [studentName, studentCode, studentGrade]
        )

        if (studentResult.rows.length === 0) {
            console.log('Student not found')
            return res.status(404).json({message: 'Data tidak ditemukan'})
        }

        await pool.query(
            `INSERT INTO ${tableName} (student_name, student_code, date, status) VALUES ($1, $2, $3, $4)`,
            [studentName, studentCode, date, status]
        )

        console.log('Attendance recorded', {
            studentName,
            studentCode,
            studentGrade,
            status
        })

        res.status(200).json({message: 'Absensi berhasil dicatat'})

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

router.get('/', async (req, res) => {
    const { studentGrade } = req.query

    try {
        const tableName = `attendance_records_${studentGrade.toLowerCase()}`
        const attendanceRecords = await pool.query(`SELECT * FROM ${tableName}`)

        res.json(attendanceRecords.rows)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error')
    }
})

module.exports = router
