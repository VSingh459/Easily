import fs from 'fs';
import path from 'path';

// Path to recruiter.json file
const filePath = path.join(path.resolve(), 'src', 'models', 'recruiter.json');

const logValidMiddleware = (req, res, next) => {
    const { email2, password2 } = req.body;

    // Log the incoming data for troubleshooting
    console.log('Received email2:', email2);
    console.log('Received password2:', password2);

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Error reading recruiter.json:', err);
            return res.status(500).json({ error: 'Server error. Please try again later.' });
        }

        const recruiters = JSON.parse(data);
        const user = recruiters.find(recruiter => recruiter.email === email2 && recruiter.password === password2);

        // Log recruiter match attempt
        console.log('Matched user:', user);

        if (user) {
            req.recruiter = user; // Attach the recruiter data to the request
            next();
        } else {
            console.error('Invalid credentials provided');
            res.status(401).json({ error: 'Invalid email or password' });
        }
    });
};

export { logValidMiddleware };


