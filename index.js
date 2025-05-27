import exp from 'express';
import path from 'path';
import multer from 'multer';
import ejsLayouts from 'express-ejs-layouts';
import session from 'express-session';
import { v4 as uuidv4 } from 'uuid';

import EasyJobsController from './src/controllers/easyJobs.controller.js';
import { validateFormData } from './src/middlewares/validation.middleware.js';
import { recValidMiddleware } from './src/middlewares/recValid.middleware.js';
import fs from 'fs';
import { logValidMiddleware } from './src/middlewares/logValid.middleware.js';
import { requireLogin } from './src/middlewares/auth.middleware.js';
import AuthController from './src/controllers/auth.controller.js';
import JobModel from './src/models/job.model.js';

const server = exp();

// Define the path to recruiter.json in the models folder
const filePath = path.join(path.resolve(), 'src', 'models', 'recruiter.json');

// Configure Multer storage for saving files to the 'public/resume' directory
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join('public', 'resume'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

// Configure Multer with a file filter to only allow PDF files
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
});

// View Engine Settings
server.set('view engine', 'ejs');
server.set('views', path.join(path.resolve(), 'src', 'views'));
server.use(ejsLayouts);

// Middleware for static files in the 'public' directory
server.use(exp.static(path.join(path.resolve(), 'public')));
// server.use(exp.static(path.join(path.resolve(), 'src', 'views')));

// Middleware to parse URL-encoded and JSON request bodies
server.use(exp.urlencoded({ extended: true }));
server.use(exp.json());

// Session middleware
server.use(session({
    secret: 'SecretKey',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));

// Middleware to make `user` accessible in all views
server.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Initialize EasyJobsController instance
const easyJob = new EasyJobsController();

server.use((req, res, next) => {
    console.log(`Session data:`, req.session);
    next();
});



// Routes
server.get('/', easyJob.getEasyJobs);
server.get('/job', (req, res) => {
    const user = req.session.user;
    let jobs;

    if (user && user.role === 'recruiter') {
        // Get jobs for the logged-in recruiter
        jobs = JobModel.getJobsByRecruiter(user.id); // Pass the recruiter's ID to fetch their jobs only
    } else {
        // Get all jobs for job seekers or guests
        jobs = JobModel.getAllJobs();
    }

    res.render('job', {
        user,
        jobs
    });
});
server.get('/d1', easyJob.showDetails);
server.get('/success.html', (req, res) => {
    res.sendFile(path.join(path.resolve(), 'src', 'views', 'success.html'));
});
server.get('/postJob', easyJob.postJob);

// Route for handling form submission with file upload and validation middleware
// Path to applications.json
const applicationsPath = path.join(path.resolve(), 'src', 'models', 'applications.json');

server.post('/submit-form', upload.single('resume'), validateFormData, (req, res) => {
    const { name, email, contact, jobId } = req.body;
    const resumeFile = req.file;

    if (!resumeFile) {
        return res.status(400).json({ errorMessage: 'Resume file is required.' });
    }

    // Load existing applications
    let applications = [];
    if (fs.existsSync(applicationsPath)) {
        applications = JSON.parse(fs.readFileSync(applicationsPath, 'utf-8'));
    }

    // Create new application entry
    const newApplication = {
        id: uuidv4(),
        jobId,  // Associate application with specific job
        name,
        email,
        contact,
        resumePath: `/resume/${resumeFile.filename}`,
    };

    // Add new application and save back to JSON
    applications.push(newApplication);
    fs.writeFileSync(applicationsPath, JSON.stringify(applications, null, 2));

    res.status(200).json({ message: 'Application submitted successfully', redirectUrl: '/success.html' });
});

// Updated /register route with validation and data persistence
server.post('/registerSuccess', recValidMiddleware, (req, res) => {
    const { name, email, password } = req.body;

    if (!req.recruiters) {
        console.error('Middleware did not pass recruiter data');
        return res.status(500).json({ error: 'Server error: no recruiter data from middleware' });
    }

    const recruiters = req.recruiters;

    // Generate a unique ID for the recruiter
    const recruiter_id = uuidv4();

    // Add new recruiter with the unique ID
    recruiters.push({ recruiter_id, name, email, password });

    // Write to recruiter.json
    fs.writeFile(filePath, JSON.stringify(recruiters, null, 2), (writeErr) => {
        if (writeErr) {
            console.error('Error writing to recruiter.json:', writeErr);
            return res.status(500).json({ error: 'Server error while writing file' });
        }

        // Store recruiter in the session after saving
        req.session.user = {
            id: recruiter_id,
            name,
            role: 'recruiter'
        };

        res.render('registerSuccess', { user: req.session.user });
    });
});

// Login route using AuthController
server.post('/login', logValidMiddleware, (req, res) => {
    const recruiter = req.recruiter;

    // Set up the session for the logged-in recruiter
    req.session.user = {
        id: recruiter.recruiter_id,
        name: recruiter.name,
        role: 'recruiter'
    };

    // Explicitly save the session and then redirect
    req.session.save((err) => {
        if (err) {
            console.error("Error saving session:", err);
            return res.status(500).send("An error occurred while logging in.");
        }
        // Redirect to the jobs page only after the session is saved
        res.redirect('/job');
    });
});




server.post('/post-job', (req, res) => {
    const { cName, jLoc, salary, tPos, deadline, category, designation, skills } = req.body;
    const recruiterId = req.session.user.id;

    // Create a new job instance
    const newJob = new JobModel(
        cName, 
        category, 
        designation, 
        jLoc, 
        salary, 
        skills.split(", "), 
        deadline, 
        tPos, 
        new Date().toLocaleString(), 
        recruiterId
    );

    // Save the job permanently
    JobModel.addJob(newJob);

    // Redirect to job page after posting the job
    res.redirect('/job');
});


// Logout route
server.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send("Unable to log out");
        }
        res.redirect('/'); // Redirect to home or login page after logout
    });
});

// Route to  applicants.ejs
server.get('/applicants', (req, res) => {
    const jobId = req.query.jobId;
    
    // Load applications from JSON file
    const applications = fs.existsSync(applicationsPath)
        ? JSON.parse(fs.readFileSync(applicationsPath, 'utf-8'))
        : [];

    // Filter applications by job ID
    const jobApplications = applications.filter(app => app.jobId === jobId);

    res.render('applicants', { applicants: jobApplications });
});

// Update route handling and update form submission



// Handle the update form submission
// Route to render the job update form
server.get('/job/:id/edit', (req, res) => {
    console.log("Entering GET /job/:id/edit route");
    if (!req.session.user || req.session.user.role !== 'recruiter') {
        console.log("User is not logged in as a recruiter.");
        return res.status(403).send("Unauthorized: Please log in as a recruiter.");
    }

    const jobId = req.params.id;
    console.log("Job ID from params:", jobId);

    const job = JobModel.getById(jobId);
    console.log("Retrieved Job:", job);

    if (job) {
        console.log("Job recruiterId:", job.recruiterId);
        console.log("Session user ID:", req.session.user.id);
    }

    if (job && job.recruiterId === req.session.user.id) {
        res.render('updateJob', { job, isUpdate: true });
    } else {
        console.log("Authorization failed: Unauthorized or Job not found.");
        res.status(403).send("Unauthorized or Job not found.");
    }
});



// Route to handle the job update form submission
server.post('/job/:id/edit', (req, res) => {
    // Check if the user is logged in as a recruiter
    if (!req.session.user || req.session.user.role !== 'recruiter') {
        return res.status(403).send("Unauthorized: Please log in as a recruiter.");
    }

    const jobId = req.params.id;
    const { cName, jLoc, salary, tPos, deadline, category, designation, skills } = req.body;

    // Construct the updated job object with the provided form data
    const updatedJob = {
        id: jobId,
        cname: cName,
        field: category,
        jname: designation,
        desc: jLoc,
        salary,
        skills: skills.split(", "), // Convert skills to an array
        deadline,
        openings: tPos,
        recruiterId: req.session.user.id
    };

    // Attempt to update the job
    const success = JobModel.updateJob(updatedJob);
    if (success) {
        res.redirect(`/d1?jobId=${jobId}`); // Redirect to the job details page
    } else {
        res.status(500).send("Error updating job.");
    }
});

// Delete Route

server.delete('/job/:id', (req, res) => {
    const jobId = req.params.id;
    
    if (!req.session.user || req.session.user.role !== 'recruiter') {
        return res.status(403).send("Unauthorized: Please log in as a recruiter.");
    }

    const deleted = JobModel.deleteJobById(jobId, req.session.user.id);

    if (deleted) {
        res.status(200).json({ message: 'Job deleted successfully' });
    } else {
        res.status(404).json({ message: 'Job not found or not authorized' });
    }
});



// Start the server
server.listen(3400, () => {
    console.log('Server is listening on port 3400');
});
