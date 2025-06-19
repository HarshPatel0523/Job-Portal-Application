import Job from "../models/job.model.js";

export const postJob = async (req, res) => {
    try {
        const { title, description, location, salary, requirements, jobType, experience, position, companyId } = req.body;
        const userId = req.id

        if (!title || !description || !location || !salary || !jobType || !companyId || !experience || !position || !requirements) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const jobData = {
            title,
            description,
            location,
            salary: parseFloat(salary),
            jobType,
            requirements: requirements.split(",").map(req => req.trim()),
            experience,
            positions: parseInt(position),
            company: companyId,
            createdBy: userId
        };

        const job = await Job.create(jobData);
        if (!job) {
            return res.status(500).json({
                message: "Failed to create job"
            });
        }

        return res.status(201).json({
            message: "Job created successfully",
            job: jobData
        });
    } catch (error) {
        console.error("Error creating job:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };

        const jobs = await Job.find(query).populate('company', 'name').populate('createdBy', 'name').sort({ createdAt: -1 });

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: "No jobs found"
            });
        }

        return res.status(200).json({
            message: "Jobs fetched successfully",
            jobs,
            success: true
        });
    } catch (error) {
        console.error("Error fetching jobs:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId)
            .populate({
                path: "applications"
            })

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Job fetched successfully",
            job,
            success: true
        });
    } catch (error) {
        console.error("Error fetching job:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ createdBy: adminId });

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({
                message: "No jobs found for this user"
            });
        }

        return res.status(200).json({
            message: "Jobs fetched successfully",
            jobs,
            success: true
        });
    } catch (error) {
        console.error("Error fetching admin jobs:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}