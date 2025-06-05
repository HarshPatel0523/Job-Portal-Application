import Company from "../models/company.model.js";

export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required",
                success: false
            });
        }

        let existingCompany = await Company.findOne({ name: companyName });
        if (existingCompany) {
            return res.status(400).json({
                message: "Company already exists",
                success: false
            });
        }

        const newCompany = new Company({
            name: companyName,
            userId: req.id
        });

        await newCompany.save();
        res.status(201).json({
            message: "Company registered successfully",
            company: newCompany,
            success: true
        });
    } catch (error) {
        console.error("Error registering company:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const getCompany = async (req, res) => {
    try {
        const companies = await Company.find({ userId: req.id });
        if (!companies) {
            return res.status(404).json({
                message: "Companies not found",
                success: false
            });
        }
        res.status(200).json({
            message: "Companies retrieved successfully",
            companies,
            success: true
        });
    }
    catch (error) {
        console.error("Error retrieving company:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const getCompanyById = async (req, res) => {
    try {
        const { id } = req.params;
        const company = await Company.findById(id);
        if (!company) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            });
        }
        res.status(200).json({
            message: "Company retrieved successfully",
            company,
            success: true
        });
    }
    catch (error) {
        console.error("Error retrieving company:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}

export const updateCompany = async (req, res) => {
    try {
        const { companyName, description, website, location } = req.body;
        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required",
                success: false
            });
        }

        const updatedCompany = await Company.findByIdAndUpdate( req.params.id , {
            name: companyName,
            description,
            website,
            location
        }, { new: true });

        if (!updatedCompany) {
            return res.status(404).json({
                message: "Company not found",
                success: false
            });
        }

        res.status(200).json({
            message: "Company updated successfully",
            company: updatedCompany,
            success: true
        });
    } catch (error) {
        console.error("Error updating company:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
}