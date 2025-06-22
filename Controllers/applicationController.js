import application from "../Models/applicationSchema.js";
import job from "../Models/jobSchema.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    const applicationExists = await application.findOne({
      job: jobId,
      applicant: userId,
    });
    if (applicationExists) {
      return res.status(400).json({
        message: "You have already applied for this job",
        applicationExists,
      });
    }

    const newApplication = await application.create({
      job: jobId,
      applicant: userId,
    });
    const targetJob = await job.findById(jobId);
    if (!targetJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    targetJob.applications.push(newApplication._id);
    await targetJob.save();

    return res.status(200).json({
      message: "You have applied for this job",
      newApplication,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getAppliedjobs = async (req, res) => {
  try {
    const userId = req.id;
    const userApplication = await application
      .find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: [
          {
            path: "company",
            options: { sort: { createdAt: -1 } },
          },
          {
            path: "applications",
            options: { sort: { createdAt: -1 } },
          },
        ],
      });
    if (!userApplication) {
      return res.status(400).json({
        message: "No Applicatiions",
      });
    }
    return res.status(200).json({
      message: "Applications found",
      userApplication,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const applicantAppliedjob = await job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
      },
    });

    if (!applicantAppliedjob) {
      return res.status(400).json({
        message: "No Applicants",
      });
    }
    return res.status(200).json({
      message: "Applicants found",
      applicantAppliedjob,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    console.log(status, applicationId);

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
      });
    }
    const findApplication = await application.findById(applicationId);
    if (!findApplication) {
      return res.status(404).json({
        message: "Application not found",
      });
    }
    findApplication.status = status.toLowerCase();
    await findApplication.save();
    return res.status(200).json({
      message: "Status updated",
      findApplication,
    });
  } catch (error) {
    console.log(error);
  }
};
