// server/util/validateCourse.js
// Shared by POST and PUT /api/courses.
// Returns an error message string, or null when the body is valid.
function validateCourse(body) {
    if (!body || typeof body !== 'object') {
        return 'Request body must be a JSON object'
    }

    const { number, title, credits, prerequisites } = body

    if (!number || typeof number !== 'string' || number.trim() === '') {
        return 'number is required'
    }
    if (number.trim().length > 10) {
        return 'number must be 10 characters or fewer'
    }
    if (!title || typeof title !== 'string' || title.trim() === '') {
        return 'title is required'
    }
    if (title.trim().length > 100) {
        return 'title must be 100 characters or fewer'
    }
    if (credits === undefined || credits === null || credits === '') {
        return 'credits is required'
    }
    if (!Number.isInteger(Number(credits)) || Number(credits) < 0) {
        return 'credits must be a whole number'
    }

    // prerequisites is optional; when present it must be an array of ids
    if (prerequisites !== undefined &&
        (!Array.isArray(prerequisites) || !prerequisites.every(Number.isInteger))) {
        return 'prerequisites must be an array of course ids'
    }

    return null
}

module.exports = validateCourse
