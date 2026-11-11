// server/routes/completions.js
const express = require('express')
const pool = require('../util/database')
const { getCoursesWithPrereqs, replaceCompletions } = require('../util/courseData')

const router = express.Router()

const USER_ID = 1 // M3: replaced by the logged-in user's id

// Every completed course must have all of its prerequisites in the array too.
// An id that is not a real course makes the set invalid.
const isValidCompletionSet = (courses, completed) => {
    return completed.every(id => {
        const course = courses.find(c => c.id === id)
        return course && course.prerequisites.every(p => completed.includes(p))
    })
}

// Reads this user's completed course ids
async function readCompletions() {
    const [rows] = await pool.query(
        'SELECT course_id FROM completions WHERE user_id = ? ORDER BY course_id',
        [USER_ID]
    )
    return rows.map(r => r.course_id)
}

// GET /api/completions
router.get('/completions', async (req, res) => {
    try {
        res.json(await readCompletions())
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// PUT /api/completions  (body: [1, 3, 2])
router.put('/completions', async (req, res) => {
    const body = req.body
    if (!Array.isArray(body) || !body.every(Number.isInteger)) {
        return res.status(400).json({ error: 'Body must be an array of course ids' })
    }

    // Duplicates would break the (user_id, course_id) primary key
    const completed = [...new Set(body)]

    try {
        const courses = await getCoursesWithPrereqs(pool)
        if (!isValidCompletionSet(courses, completed)) {
            return res.status(400).json({
                error: 'Invalid completion list: a course is missing a prerequisite or does not exist'
            })
        }

        await replaceCompletions(pool, USER_ID, completed)
        res.json(await readCompletions())
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

module.exports = router
