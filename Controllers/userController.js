import jwt from "jsonwebtoken";
import user from "../Models/userSchema.js";
import bcrypt from "bcrypt";
import getDataUri from "../DataUri.js";
import cloudinary from "../Cloudinary.js";

export const register = async (req, res) => {
  try {
    const { fullname, email, password, phoneNumber, role } = req.body;
    const file = req.file;

    if (!fullname || !email || !password || !phoneNumber || !role || !file) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }

    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    const emailExists = await user.findOne({ email });

    if (emailExists !== null) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }
    const encryptedPassword = await bcrypt.hash(password, 10);

    let userRegistered = {
      fullname,
      email,
      password: encryptedPassword,
      phoneNumber,
      role,
      profile: {
        profilePhoto: cloudResponse.secure_url,
      },
    };

    const registered = await user.create(userRegistered);
    return res.status(200).json({
      message: "Signup Successfull",
      registered,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Required fields are missing",
      });
    }
    const emailExists = await user.findOne({ email });
    if (!emailExists) {
      return res.status(400).json({
        message: "Inavalid email or password",
      });
    }
    const comparePassword = await bcrypt.compare(
      password,
      emailExists.password
    );
    if (!comparePassword) {
      return res.status(400).json({
        message: "Inavalid email or password",
      });
    }
    if (role !== emailExists.role) {
      return res.status(400).json({
        message: "Account doesn't exists with current role",
      });
    }
    // emailExists contain users data
    let loggedInUser = {
      _id: emailExists._id,
      fullname: emailExists.fullname,
      email: emailExists.email,
      role: emailExists.role,
      profile: emailExists.profile,
      phoneNumber: emailExists.phoneNumber,
    };

    // web token
    const tokenData = { userId: emailExists._id };
    const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "None",
      })
      .json({
        message: `Welcome Back ${loggedInUser.fullname}`,
        loggedInUser,
      });
  } catch (error) {
    console.log(error);
  }
};

export const logOut = (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error);
  }
};

export const updatedProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;
    let cloudResponse = null;
    if (file) {
      const fileUri = getDataUri(file);
      cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    }

    const userId = req.id;
    let currentUser = await user.findById(userId);

    if (fullname) {
      currentUser.fullname = fullname;
    }
    if (email) {
      currentUser.email = email;
    }
    if (phoneNumber) {
      currentUser.phoneNumber = phoneNumber;
    }
    if (bio) {
      currentUser.profile.bio = bio;
    }
    if (skills) {
      currentUser.profile.skills = skills.split(",");
    }

    if (cloudResponse) {
      currentUser.profile.resume = cloudResponse.secure_url;
      currentUser.profile.resumeOriginalName = file.originalname;
    }

    await currentUser.save();
    let updatedUser = {
      _id: currentUser._id,
      fullname: currentUser.fullname,
      email: currentUser.email,
      role: currentUser.role,
      profile: currentUser.profile,
      phoneNumber: currentUser.phoneNumber,
    };

    return res.status(200).json({
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
  }
};
