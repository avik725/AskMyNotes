import mongoose from "mongoose";
import { asyncHandler } from "../utilities/asyncHandler.js";
import { apiError } from "../utilities/apiError.js";
import { apiResponse } from "../utilities/apiResponse.js";
import clearFiles from "../utilities/clearFiles.js";
import { User } from "../models/user.model.js";
import {
  destroyFromCloudinary,
  uploadOnCloudinary,
} from "../utilities/cloudinary.js";

const generateAccessandRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new apiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res, next) => {
  //get data from request body
  //validate the data
  //check if the user already exists
  //upload profile pic to cloudinary if exist
  //create a new user object
  //remove the password and refresh token from response object
  //check for user creation
  //return response

  const { fullname, username, email, password } = req.body || {};

  if (
    !fullname ||
    !username ||
    !email ||
    !password ||
    [fullname, email, username, password].some(
      (field) => typeof field !== "string" || field.trim() === ""
    )
  ) {
    clearFiles(req);
    throw new apiError(400, "All Fields Are Required");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    clearFiles(req);
    throw new apiError(409, "User with email or username already exists");
  }

  const profilePicLocalPath = req.file?.path;
  let profilePic;
  if (profilePicLocalPath) {
    profilePic = await uploadOnCloudinary(profilePicLocalPath, "users/profile_pictures");
    if (!profilePic) {
      throw new apiError(400, "Something Went wrong with cloudinary");
    }
  }

  const user = await User.create({
    fullname,
    profile_pic: profilePic ? profilePic.url : "",
    email,
    username: username.toLowerCase(),
    password,
    role: "user",
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "Something went wrong while registering user !!");
  }

  return res
    .status(201)
    .json(
      new apiResponse(200, createdUser, "User Registered Successfully !!!")
    );
});

const loginUser = asyncHandler(async (req, res, next) => {
  //get data from frontend
  //validate the data
  //check if the user exists
  //check the password matches with records
  // generate access and refresh token
  //send cookies to user to tokens

  const data = req.body;
  const { username, email, password } = data;

  if (!username && !email) {
    throw new apiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new apiError(404, "User does not exists !!");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new apiError(404, "Password does not match our records");
  }

  const { accessToken, refreshToken } = await generateAccessandRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    path: "/",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully !!!"
      )
    );
});

const logoutUser = asyncHandler(async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new apiResponse(200, {}, "User Logged Out Successfully"));
  } catch (error) {
    next();
  }
});

const checkUsernameIfAvailable = asyncHandler(async (req, res, next) => {
  //get data from frontend
  //check if any user exist with the username
  //return response

  const { username } = req.params;

  if (!username) {
    throw new apiError(400, "Username is Required");
  }

  const user = await User.findOne({ username: username });

  if (!user) {
    return res.status(200).json({
      success: true,
      message: "Username is available",
    });
  } else {
    return res.status(200).json({
      success: false,
      message: "Username is not available",
    });
  }
});

const getCurrentUser = asyncHandler(async (req, res, next) => {
  return res
    .status(200)
    .json(new apiResponse(200, req.user, "Current User Fetched Successfully"));
});

const updateUserDetails = asyncHandler(async (req, res, next) => {
  const {
    fullname,
    dob,
    gender,
    mobile,
    email,
    address,
    prefered_stream,
    prefered_language,
  } = req.body;

  if (
    !fullname ||
    !dob ||
    !gender ||
    !email ||
    [fullname, email, gender].some(
      (field) => typeof field !== "string" || field.trim() === ""
    )
  ) {
    clearFiles(req);
    throw new apiError(400, "All Fields Are Required");
  }

  const profilePicLocalPath = req.file?.path;
  let profilePic;
  if (profilePicLocalPath) {
    profilePic = await uploadOnCloudinary(profilePicLocalPath, "users/profile_pictures");
    if (!profilePic) {
      clearFiles(req);
      throw new apiError(400, "Something went wrong with cloudinary");
    }
  }

  const oldUserData = await User.findById(req.user._id).select("profile_pic");
  if (profilePic?.url && oldUserData?.profile_pic) {
    let destroyResponse = await destroyFromCloudinary(oldUserData?.profile_pic);
    if (destroyResponse.result !== "ok") {
      throw new apiError(
        500,
        "Something went wrong while deleting old profile_pic on cloudinary"
      );
    }
  }

  const updates = {
    ...(fullname && { fullname }),
    ...(profilePic?.url && { profile_pic: profilePic.url }),
    ...(email && { email }),
    ...(gender && { gender }),
    ...(dob && { dob }),
    ...(mobile && { mobile }),
    ...(address && { address }),
    ...(prefered_stream && { prefered_stream }),
    ...(prefered_language && { prefered_language }),
  };

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true }
  ).select("-password -refreshToken");

  if (!user) {
    throw new apiError(500, "Something went wrong while updating profile !");
  }

  return res
    .status(200)
    .json(new apiResponse(200, user, "Profile Updated Successfully"));
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  const { username, email, dob, password } = req.body;

  if (
    !username ||
    !email ||
    !dob ||
    !password ||
    [username, email, password].some(
      (field) => typeof field !== "string" || field.trim() === ""
    )
  ) {
    throw new apiError(400, "All Fields are Required");
  }

  const user = await User.findOne({
    username: username.toLowerCase(),
  });

  if (!user) {
    throw new apiError(400, "Invalid Username");
  }

  const reqDob = new Date(dob).toISOString().split("T")[0];
  const userDob = new Date(user.dob).toISOString().split("T")[0];

  if (user.email !== email || userDob !== reqDob) {
    throw new apiError(400, "Invalid Email or Date Of Birth");
  }

  user.password = password;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new apiResponse(200, {}, "Password Changed Successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  checkUsernameIfAvailable,
  updateUserDetails,
  forgotPassword,
};
