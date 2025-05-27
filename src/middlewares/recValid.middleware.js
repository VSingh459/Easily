import { check, validationResult } from 'express-validator';
import fs from 'fs';
import path from 'path';

const filePath = path.join(path.resolve(), 'src', 'models', 'recruiter.json'); // Path to recruiter.json file

const recValidMiddleware = [
    // Initial validation checks for fields
    check('name').notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
    check('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Please provide a valid email address'),
    check('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    // Middleware to handle validation errors before duplicate checks
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next(); // Proceed if validation passes
    },

    // Custom middleware to check for duplicates in recruiter.json
    (req, res, next) => {
        const { name, email, password } = req.body;

        // Read recruiter.json to check for existing data
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) {
                console.error('Error reading recruiter.json:', err);
                return res.status(500).json({ error: 'Server error while reading file' });
            }

            // Parse existing recruiters or initialize an empty array if no data
            const recruiters = data ? JSON.parse(data) : [];

            // Check for existing user with the same name, email, or password
            const existingUser = recruiters.find(
                (r) => r.name === name || r.email === email || r.password === password
            );

            if (existingUser) {
                if (existingUser.name === name) {
                    return res.status(400).json({ error: 'User with this name already exists' });
                }
                if (existingUser.email === email) {
                    return res.status(400).json({ error: 'User with this email already exists' });
                }
                if (existingUser.password === password) {
                    return res.status(400).json({ error: 'This password is already in use' });
                }
            }

            // Store the parsed data in the request object to use later in the route
            req.recruiters = recruiters;
            next(); // Proceed to the next step if no duplicates are found
        });
    }
];

export { recValidMiddleware }; // Export the middleware for use in other files
