import JobModel from '../models/job.model.js';
import UserModel from '../models/userData.model.js';
import path from 'path';

export default class EasyJobsController {
    // Method to render the home page
    getEasyJobs(req, res) {
        res.render('home');
    }

    // Method to render the jobs page
    showJobs(req, res) {
        const jobs = JobModel.get();
        res.render('job', { jobs });  // Pass all jobs to job.ejs if needed
    }

    // Method to render job details, fetching job data based on job ID
    showDetails(req, res) {
        const jobId = req.query.jobId;  // No need for parseInt if job.id is a string
        const job = JobModel.getById(jobId);
    
        if (job) {
            const isOwner = req.session.user && req.session.user.id === job.recruiterId;
            res.render('d1', {
                job,
                isOwner,
                errorMessage: null,
                successMessage: null,
            });
        } else {
            res.render('d1', {
                job: null,
                isOwner: false,
                errorMessage: 'Job not found',
                successMessage: null,
            });
        }
    }
    
    

    // Other methods...


    // Method to handle form submission with file upload
    submitForm(req, res) {
        const { name, email, contact, jobId } = req.body;
    
        // Access uploaded file
        const resumeFile = req.file;

        if (!resumeFile) {
            return res.status(400).json({ errorMessage: 'File upload failed. Only PDF files are allowed.' });
        }

        // Save user data with the path to the uploaded resume file
        UserModel.add({ name, email, contact, resumePath: path.join('public', 'resume', resumeFile.filename) });
        console.log('Current Users Array:', UserModel.getAll()); // For learning purposes
        console.log('Resume uploaded:', resumeFile.filename); // Log uploaded file name
    
        // Send JSON response with the redirect URL for AJAX to handle
        res.status(200).json({ redirectUrl: '/success.html' });
    }

    // Method to render the  Post Job Application
    // Method to render the Post Job Application form
// Method to render the Post Job Application form
// Method to render the Post Job Application form
postJob(req, res) {
    console.log('Rendering postJob.ejs with:', { job: {}, isUpdate: false, selectedSkills: [] });
    res.render('postJob', { job: {}, isUpdate: false, selectedSkills: [] });
}

}



