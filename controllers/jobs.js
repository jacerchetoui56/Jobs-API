const { BadRequestError } = require("../errors")
const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')

//status options
const statusOptions = ["interview", "declined", "pending"]

const getAllJobs = async (req, res) => {
    const { userId } = req.user
    const jobs = await Job.find({ createdBy: userId })
    res.status(StatusCodes.OK).json({ success: true, count: jobs.length, jobs })
}

const getJob = async (req, res) => {
    const { userId } = req.user
    const jobId = req.params.id

    const job = await Job.find({ createdBy: userId, _id: jobId })
        .select('company position status')
    if (!job) {
        throw new BadRequestError('No Job Found')
    }
    res.status(StatusCodes.OK).json({ success: job.length > 0, job: { ...job } })
}
const createJob = async (req, res) => {
    const { position, company } = req.body
    if (!position || !company) {
        throw new BadRequestError('Please provide the company and position names')
    }
    // this is not the best way to check the status ...
    let status = ''
    if (req.body.status && !statusOptions.includes(req.body.status)) {
        status = 'pending'
    } else {
        status = req.body.status
    }
    const { userId } = req.user
    const job = await Job.create({ position, company, status, createdBy: userId })
    res.json({ success: true, msg: 'job created' })
}
const updateJob = async (req, res) => {
    const { userId } = req.user
    const jobId = req.params.id
    const { position, company, status } = req.body
    const newData = {}
    position && (newData.position = position)
    company && (newData.company = company)
    status && (newData.status = status)
    try {
        const job = await Job.findOneAndUpdate({ createdBy: userId, _id: jobId }, { ...newData }, {
            new: true,
            runValidators: true
        })
        if (!job) {
            throw new BadRequestError('Something went wrong, please try again later')
        }
        res.status(StatusCodes.OK).json({ success: true })
    } catch (error) {
        throw new BadRequestError('Something went wrong ,please try again later')
    }
}
const deleteJob = async (req, res) => {
    const { userId } = req.user
    const jobId = req.params.id

    try {
        const job = await Job.findOneAndDelete({ createdBy: userId, _id: jobId })
        if (!job) {
            throw new NotFoundError(`No Job with id : ${jobId}`)
        }
        res.status(StatusCodes.OK).json({ success: true })
    } catch (error) {
        throw new BadRequestError('Something went wrong ,please try again later')
    }
}

module.exports = {
    getAllJobs,
    getJob,
    updateJob,
    deleteJob,
    createJob
}