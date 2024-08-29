const User = require('../models/user');
const upload = require('../config/multerConfig');
const fs = require('fs');
const path = require('path');
exports.deleteResume = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.resume && user.resume.path) {
            // Remove the file from the server
            const filePath = path.join(__dirname, '..', user.resume.path);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('File deletion error:', err);
                }
            });

            // Remove the resume information from the user
            user.resume = {};
            await user.save();

            res.json({ message: 'Resume deleted successfully' });
        } else {
            res.status(404).json({ message: 'No resume to delete' });
        }
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
exports.uploadResume = (req, res) => {
    upload.single('resume')(req, res, async (err) => {
        if (err) {
            console.error('Upload error:', err);
            return res.status(400).json({ message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        try {
            const userId = req.user._id;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Update resume field with the path of the uploaded file
            user.resume = {
                path: req.file.path,
                originalName: req.file.originalname,
                size: req.file.size,
                uploadDate: new Date(),
            };

            await user.save();

            res.json({
                message: 'Resume uploaded successfully',
                resume: {
                    path: `http://localhost:5000/${req.file.path}` // Return full URL
                },
            });
        } catch (error) {
            console.error('Server error:', error);
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    });
};
