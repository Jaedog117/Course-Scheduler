// server/routes/courses.js
const express = require('express')
const pool = require('../util/database')
const { getCoursesWithPrereqs } = require('../util/courseData')
const validateCourse = require('../util/validateCourse')

const router = express.Router()

// Returns an error message if any prerequisite id is not a real course
// (or is the course itself), otherwise null. Runs BEFORE any write so a bad
// request never leaves a half-saved course behind.
async function checkPrereqIds(prereqIds, courseId) {
    if (prereqIds.length === 0) return null
    if (courseId !== undefined && prereqIds.includes(courseId)) {
        return 'A course cannot be its own prerequisite'
    }
    const [found] = await pool.query('SELECT id FROM courses WHERE id IN (?)', [prereqIds])
    if (found.length !== prereqIds.length) {
        return 'One or more prerequisite ids do not exist'
    }
    return null
}

// GET /api/courses
router.get('/courses', async (req, res) => {
    try {
        const courses = await getCoursesWithPrereqs(pool)
        res.json(courses)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// GET /api/courses/:id
router.get('/courses/:id', async (req, res) => {
    try {
        const course = await getCoursesWithPrereqs(pool, Number(req.params.id))
        if (!course) return res.status(404).json({ error: 'Course not found' })
        res.json(course)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// POST /api/courses
router.post('/courses', async (req, res) => {
    const invalid = validateCourse(req.body)
    if (invalid) return res.status(400).json({ error: invalid })

    const { number, title, credits, description } = req.body
    const prereqIds = [...new Set(req.body.prerequisites || [])]

    try {
        const prereqProblem = await checkPrereqIds(prereqIds)
        if (prereqProblem) return res.status(400).json({ error: prereqProblem })

        const [result] = await pool.query(
            'INSERT INTO courses (number, title, credits, description) VALUES (?, ?, ?, ?)',
            [number.trim(), title.trim(), Number(credits), description ?? null]
        )
        const newId = result.insertId

        if (prereqIds.length > 0) {
            const rows = prereqIds.map(prereqId => [newId, prereqId])
            await pool.query('INSERT INTO prerequisites (course_id, prereq_id) VALUES ?', [rows])
        }

        const created = await getCoursesWithPrereqs(pool, newId)
        res.status(201).json(created)
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: `A course numbered ${number} already exists` })
        }
        res.status(500).json({ error: err.message })
    }
})

// PUT /api/courses/:id
router.put('/courses/:id', async (req, res) => {
    const invalid = validateCourse(req.body)
    if (invalid) return res.status(400).json({ error: invalid })

    const id = Number(req.params.id)
    const { number, title, credits, description } = req.body
    const prereqIds = [...new Set(req.body.prerequisites || [])]

    try {
        const prereqProblem = await checkPrereqIds(prereqIds, id)
        if (prereqProblem) return res.status(400).json({ error: prereqProblem })

        const [result] = await pool.query(
            'UPDATE courses SET number = ?, title = ?, credits = ?, description = ? WHERE id = ?',
            [number.trim(), title.trim(), Number(credits), description ?? null, id]
        )
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Course not found' })
        }

        // Replace the whole prerequisite list: delete the old rows, insert the new ones
        await pool.query('DELETE FROM prerequisites WHERE course_id = ?', [id])
        if (prereqIds.length > 0) {
            const rows = prereqIds.map(prereqId => [id, prereqId])
            await pool.query('INSERT INTO prerequisites (course_id, prereq_id) VALUES ?', [rows])
        }

        const updated = await getCoursesWithPrereqs(pool, id)
        res.json(updated)
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: `A course numbered ${number} already exists` })
        }
        res.status(500).json({ error: err.message })
    }
})

// DELETE /api/courses/:id
router.delete('/courses/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)
        // Fetch first so we can send the deleted course back
        const course = await getCoursesWithPrereqs(pool, id)
        if (!course) return res.status(404).json({ error: 'Course not found' })

        // ON DELETE CASCADE removes the related prerequisites and completions rows
        await pool.query('DELETE FROM courses WHERE id = ?', [id])
        res.json(course)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router
