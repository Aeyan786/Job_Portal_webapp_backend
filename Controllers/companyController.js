import cloudinary from "../Cloudinary.js";
import getDataUri from "../DataUri.js";
import company from "../Models/companySchema.js";
import job from "../Models/jobSchema.js";

export const registerCompany = async (req, res) => {
  try {
    const { name, location, website, description } = req.body;
    const logo = req.file;

    if (!name || !location || !logo) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }
    const fileUri = getDataUri(logo);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    const companyExist = await company.findOne({ name });
    if (companyExist) {
      return res.status(400).json({
        message: "Company is already registered",
      });
    }
    const registeredCompany = await company.create({
      name: name,
      location: location,
      website: website,
      description: description,
      logo: cloudResponse.secure_url,
      userId: req.id,
    });
    return res.status(200).json({
      message: "Company is registered successfully",
      registeredCompany,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getCompany = async (req, res) => {
  try {
    const userId = req.id;
    const companies = await company.find({ userId });
    if (!companies) {
      return res.status(404).json({ message: "Company not found" });
    }
    return res.status(201).json({ message: "Company found", companies });
  } catch (error) {
    console.log(error);
  }
};

export const getSingleCompany = async (req, res) => {
  try {
    const companyID = req.params.id;
    const singleCompany = await company.findById(companyID);
    if (!singleCompany) {
      return res
        .status(404)
        .json({ message: "Company not found" }, singleCompany);
    }
    return res.status(200).json({ message: "Company found", singleCompany });
  } catch (error) {
    console.log(error);
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { name, location, description, website } = req.body;
    const logo = req.file;

    let cloudResponse = null;

    if (logo) {
      const fileUri = getDataUri(logo);
      cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    }

    const companyData = {
      name: name,
      location: location,
      description: description,
      website: website,
      logo: cloudResponse?.secure_url,
    };
    const updatedCompanyData = await company.findByIdAndUpdate(
      req.params.id,
      companyData,
      { new: true }
    );
    if (!updatedCompanyData) {
      return res.status(404).json({ message: "Company not found" });
    }
    return res.status(200).json({
      message: "Company Information has been updated",
      updatedCompanyData,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteCompany = async (req, res) => {
  const companyId = req.params.id;

  const relatedJobs = await job.find({ company: companyId });

  if (relatedJobs.length > 0) {
    return res.status(400).json({
      message:
        "Company cannot be deleted. Please delete its related jobs first.",
    });
  }

  const deleteCompany = await company.findByIdAndDelete(companyId);
  if (!deleteCompany) {
    return res.status(404).json({
      message: "Id not found",
    });
  }

  return res.status(200).json({
    message: "Company has been deleted",
    deleteCompany,
  });
};
