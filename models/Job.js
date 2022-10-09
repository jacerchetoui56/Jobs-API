const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    position: {
        type: String,
        require: [true, "Please provide a company name"],
        maxlength: 30,
    },
    company: {
        type: String,
        require: [true, "Please provide a company name"],
        maxlength: 30,
    },
    status: {
        type: String,
        enum: ["interview", "declined", "pending"],
        default: 'pending'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true }); //!this adds createdAt and updatedAt elements


module.exports = mongoose.model("Job", jobSchema);
