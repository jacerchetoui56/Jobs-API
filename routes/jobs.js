const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/authentication')
const {
    getAllJobs,
    getJob,
    updateJob,
    deleteJob,
    createJob
} = require('../controllers/jobs')

router.use(authMiddleware)

router.route('/').get(getAllJobs).post(createJob)
router.route('/:id').get(getJob).patch(updateJob).delete(deleteJob)

module.exports = router