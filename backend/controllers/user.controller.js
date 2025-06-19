import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const registerUser = async (req, res) => {
    try {
        const { fullName, email, password, phoneNumber, role } = req.body;

        // Validate required fields
        if (!fullName || !email || !password || !phoneNumber || !role) {
            return res.status(400).json({
                message: "Something is Missing!!!",
                success: false
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
            phoneNumber,
            role,
        });

        await newUser.save();

        res.status(201).json({
            message: "User registered successfully",
            user: newUser,
            success: true
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is Missing!!!",
                success: false
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials",
                success: false
            });
        }

        // Check Role of the user
        if (role && role !== user.role) {
            return res.status(403).json({
                message: `Access denied for role: ${role}`,
                success: false
            });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION || '1h' });

        // Return success response with token and user details
        return res.status(200).cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000, // 1 hour
            sameSite: "Strict",
        }).json({
            success: true,
            message: "Login successful, Welcome " + user.fullName + "!",
            token,
            user: { id: user._id, fullName: user.fullName, role: user.role, email: user.email, phoneNumber: user.phoneNumber, profile: user.profile }
        });

    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const logoutUser = async (req, res) => {
    try {
        res.status(200).cookie("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 0, // Clear the cookie
            sameSite: "Strict",
        }).json({
            message: "Logout successful",
            success: true
        });
    } catch (error) {
        console.error("Error logging out user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateProfile = async (req, res) => {
    try {
        // const { userId } = req.params;
        const { fullName, email, phoneNumber, bio, skills } = req.body;

        // Find user by ID
        const userId = req.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        // Prepare updated profile fields
        const profile = { ...user.profile };
        if (bio) profile.bio = bio;
        if (skills) {
            profile.skills = skills.split(',').map(skill => skill.trim());
        }

        // Update user fields if provided
        if (fullName) user.fullName = fullName;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        user.profile = profile;

        await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                role: user.role,
                email: user.email,
                phoneNumber: user.phoneNumber,
                profile: user.profile
            },
            success: true
        });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};