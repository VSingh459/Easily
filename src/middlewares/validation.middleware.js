import { body, validationResult } from 'express-validator';

// Define validation rules for form fields
const formValidationRules = [
    body('name')
        .notEmpty()
        .withMessage('Name is required.')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Name must be at least 3 characters long.'),
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address.'),
    body('contact')
        .isLength({ min: 10, max: 10 })
        .withMessage('Contact number must be exactly 10 digits.')
        .isNumeric()
        .withMessage('Contact number must contain only numbers.')
];

// Middleware to validate form data and file type
export const validateFormData = async (req, res, next) => {
    // Run the form validation rules
    await Promise.all(formValidationRules.map(rule => rule.run(req)));

    // Check for validation errors in form fields
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        // If there are validation errors, return the first error message
        const errorMessage = validationErrors.array()[0].msg;
        return res.status(400).json({ errorMessage });
    }

    // Check if a file was uploaded
    if (!req.file) {
        return res.status(400).json({ errorMessage: 'Resume file is required.' });
    }

    // Server-side validation for file type
    if (req.file.mimetype !== 'application/pdf') {
        return res.status(400).json({ errorMessage: 'Only PDF files are allowed.' });
    }

    // If no errors, proceed to the next middleware or route handler
    next();
};

