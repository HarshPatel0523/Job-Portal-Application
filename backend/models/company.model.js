import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String
    // required: true,
  },
  website: {
    type: String
    // required: true,
  },
  logo: {
    type: String, // URL to the company logo
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    type: String
    // required: true,
  }
}, {
  timestamps: true,
});

const Company = mongoose.model("Company", companySchema);

export default Company;