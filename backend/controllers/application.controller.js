import Application from "../models/application.model.js";
import Job from "../models/job.model.js";

export const applyJob = async (req, res) => {   
    try {
        const userId = req.id;
        const jobId = req.params.id;  

        if (!jobId) {
            return res.status(400).json({ 
                message: 'Job ID is required.' 
            });
        }

        const existingApplication = await Application.findOne({
            applicant: userId,
            job: jobId
        });

        if (existingApplication) {
            return res.status(400).json({ 
                message: 'You have already applied for this job.' 
            });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ 
                message: 'Job not found.' 
            });
        }

        const newApplication = new Application({
            applicant: userId,
            job: jobId,
        });

        await newApplication.save();

        job.applications.push(newApplication._id);
        await job.save();

        return res.status(200).json({ 
            message: 'Application submitted successfully.',
            application: newApplication,
            success: true
        });
    } catch (error) {
        console.error('Error applying for job:', error);
        return res.status(500).json({ message: 'An error occurred while applying for the job.' });
    }
}

export const getApplications = async (req, res) => {
    try {
        const userId = req.id;

        const applications = await Application.find({ applicant: userId })
            .populate('job', 'title company')
            .populate('applicant', 'name email')
            .sort({ createdAt: -1 });


        if (!applications || applications.length === 0) {
            return res.status(404).json({ 
                message: 'No applications found.' 
            });
        }

        return res.status(200).json({
            applications,
            message: 'Applications fetched successfully.',
            success: true
        });
    } catch (error) {
        console.error('Error fetching applications:', error);
        return res.status(500).json({ message: 'An error occurred while fetching applications.' });
    }
}

export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({ 
                message: 'Job ID is required.' 
            });
        }

        const job = await Job.findById(jobId).populate({
            path: 'applications',
            populate: {
                path: 'applicant',
            }
        });

        if (!job) {
            return res.status(404).json({ 
                message: 'Job not found.' 
            });
        }

        return res.status(200).json({
            applications : job.applications,
            message: 'Applicants fetched successfully.',
            success: true
        });
    } catch (error) {
        console.error('Error fetching applicants:', error);
        return res.status(500).json({ message: 'An error occurred while fetching applicants.' });
    }
}

export const updateApplicationStatus = async (req, res) => {
    try {
        const applicationId = req.params.id;
        const { status } = req.body;

        if (!applicationId || !status) {
            return res.status(400).json({ 
                message: 'Application ID and status are required.' 
            });
        }

        const validStatuses = ['Pending', 'Accepted', 'Rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                message: 'Invalid status provided.' 
            });
        }

        const application = await Application.findByIdAndUpdate(
            applicationId,
            { status: status },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({ 
                message: 'Application not found.' 
            });
        }

        return res.status(200).json({
            application,
            message: 'Application status updated successfully.',
            success: true
        });
    } catch (error) {
        console.error('Error updating application status:', error);
        return res.status(500).json({ message: 'An error occurred while updating the application status.' });
    }
}