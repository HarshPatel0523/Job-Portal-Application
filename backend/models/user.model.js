import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  role : {
    type: String,
    enum: ['Student', 'Recruiter'],
    required: true,
  },
  profile : {
    bio: {
        type : String,
    },
    skills: [{
        type: String,
    }],
    resume : {
        type: String, // URL to the resume file
    },
    resumeFileName : {
        type: String,
    },
    company : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
    },
    profilePicture: {
        type: String, // URL to the profile picture
        default: ""
    },
  }
}, {
  timestamps: true,
});

const User = mongoose.model("User", userSchema);

export default User;
