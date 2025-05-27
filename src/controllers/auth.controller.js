// src/controllers/auth.controller.js

class AuthController {
    login(req, res) {
        if (!req.recruiter) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        req.session.user = {
            email: req.recruiter.email,
            name: req.recruiter.name, // Use the actual recruiter's name
            role: 'recruiter'
        };

        // Render the jobs page with user data after login
        res.render('job', { user: req.session.user });
    }
}

export default new AuthController();
