const User = require('../models/user');

exports.getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            resume: user.resume,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

exports.updateUserProfile = async (req, res) => {
    try {
        const updateFields = {
            name: req.body.name,
            email: req.body.email,
            resume: req.body.resume
        };
        if (req.body.password) {
            updateFields.password = req.body.password;
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (updatedUser) {
            res.json({
                _id: updatedUser._id,
                updateFields
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};