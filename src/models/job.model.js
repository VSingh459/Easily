import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const jobsFilePath = path.join(path.resolve(), 'src', 'models', 'jobs.json');

export default class JobModel {
    constructor(cname, field, jname, desc, salary, skills, deadline, openings, datePosted, recruiterId) {
        this.id = uuidv4(); // Assign a unique ID to each job once during construction
        this.cname = cname;
        this.field = field;
        this.jname = jname;
        this.desc = desc;
        this.salary = salary;
        this.skills = skills;
        this.deadline = deadline;
        this.openings = openings;
        this.datePosted = datePosted;
        this.recruiterId = recruiterId;
    }

    // Load jobs from the JSON file
    static loadJobs() {
        if (fs.existsSync(jobsFilePath)) {
            const data = fs.readFileSync(jobsFilePath, 'utf-8');
            return JSON.parse(data);
        }
        return [];
    }

    // Retrieve a job by its unique ID
    static getById(id) {
        const jobs = JobModel.loadJobs();
        return jobs.find(job => job.id === id) || null;
    }

    // Add a new job to the list and save it
    static addJob(job) {
        const jobs = JobModel.loadJobs();
        jobs.push(job); // No need to assign an id again, it's already set in the constructor
        fs.writeFileSync(jobsFilePath, JSON.stringify(jobs, null, 2), 'utf-8');
    }

    // Update an existing job by its ID
    static updateJob(updatedJob) {
        const jobs = JobModel.loadJobs();
        const jobIndex = jobs.findIndex(job => job.id === updatedJob.id);
        
        if (jobIndex !== -1) {
            jobs[jobIndex] = { ...jobs[jobIndex], ...updatedJob };
            fs.writeFileSync(jobsFilePath, JSON.stringify(jobs, null, 2), 'utf-8');
            return true;
        }
        return false;
    }

    // Retrieve all jobs
    static getAllJobs() {
        return JobModel.loadJobs();
    }

    // Retrieve jobs by recruiter ID
    static getJobsByRecruiter(recruiterId) {
        const jobs = JobModel.loadJobs();
        return jobs.filter(job => job.recruiterId === recruiterId);
    }

    // Delete Job
    static deleteJobById(jobId, recruiterId) {
        const jobs = JobModel.loadJobs();
        const jobIndex = jobs.findIndex(job => job.id === jobId && job.recruiterId === recruiterId);
    
        if (jobIndex !== -1) {
            jobs.splice(jobIndex, 1); // Remove the job
            fs.writeFileSync(jobsFilePath, JSON.stringify(jobs, null, 2), 'utf-8'); // Save updated jobs
            return true;
        }
    
        return false;
    }
    
}
