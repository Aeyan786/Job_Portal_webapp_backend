import job from "../Models/jobSchema.js";

export const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      position,
      companyId,
    } = req.body;

    const userID = req.id;
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !position ||
      !companyId
    ) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    const jobExists = await job.findOne({ title });
    if (jobExists) {
      return res.status(400).json({
        message: "Job is already posted",
      });
    }
    const createdJob = await job.create({
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      position,
      company: companyId,
      created_by: userID,
    });
    return res.status(200).json({
      message: "Job is created successfully",
      createdJob,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";
    const query = {
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    };
    const allJobs = await job
      .find(query)
      .populate("company")
      .sort({ createdAt: -1 });
    if (!allJobs) {
      return res.status(404).json({
        message: "Jobs not found",
      });
    }
    return res.status(201).json({
      message: "Jobs found",
      allJobs,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;

    const getSingleJob = await job
      .findById(jobId)
      .populate("company")
      .populate("applications");
    if (!getSingleJob) {
      return res.status(404).json({
        message: "Jobs not found",
      });
    }
    return res.status(201).json({
      message: "Jobs found",
      getSingleJob,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteJob = async (req, res) => {
  const jobId = req.params.id;
  try {
    const deleteJob = await job.findByIdAndDelete(jobId);
    if (!deleteJob) {
      return res.status(404).json({
        message: "Jobs not found",
      });
    }
    return res.status(200).json({
      message: "Job has been deleted",
      deleteJob,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateJob = async (req, res) => {
  const {
    title,
    description,
    requirements,
    salary,
    location,
    jobType,
    position,
    companyId,
  } = req.body;
  const jobId = req.params.id;
  const jobData = {
    title,
    description,
    requirements,
    salary,
    location,
    jobType,
    position,
    companyId,
  };
  const updatedJob = await job.findByIdAndUpdate(jobId, jobData, { new: true });
  if (!updatedJob) {
    return res.status(404).json({
      message: "Job not updated",
    });
  }
  return res.status(201).json({
    message: "Job updated successfully",
    updatedJob,
  });
};

export const getAdminJobs = async (req, res) => {
  try {
    const adminId = req.id;
    const adminJobs = await job
      .find({ created_by: adminId })
      .populate("company");
    if (!adminJobs) {
      return res.status(404).json({
        message: "Jobs not found",
      });
    }
    return res.status(201).json({
      message: "Jobs found",
      adminJobs,
    });
  } catch (error) {
    console.log(error);
  }
};
