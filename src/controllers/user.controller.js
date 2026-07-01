import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import User from "../models/user.model.js";
const registerUser=asyncHandler(async (req, res) => {
    //get user details from frontend
    //validate if fields are present
    //check if user already exists
    //check for images ,check for avatar
    //upload them on cloudinary
    //create user object - create entry in db
    //remove password and refresh token from response
    //check for user creation
    //send response to frontend
    const {fullName, email, username, password } = req.body

    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }
    //.some() is a built-in JavaScript array method. It loops through the array and asks a simple question: "Does at least one item in this array meet my condition?" * If even just one field meets the condition, .some() returns true.
    const existeduser=await User.findOne({$or:[{email},{username}]})
    //This is a specific MongoDB query operator. It allows you to search for multiple different conditions at the same time.
    if (existeduser) {
        throw new ApiError(400, "User already exists")
    }
    const avatarlocalFile=req.files?.avatar?.[0]?.path
    const coverImagelocalFile=req.files?.coverImage?.[0]?.path
    if (!avatarlocalFile) {
        throw new ApiError(400, "Avatar file is required")
    }
        const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
    //Just like in your form validation code, this is a safety check.
///If the user didn't upload any files at all, req.files might be undefined. If you try to ask for req.files.avatar when req.files doesn't exist, your server will crash. The ?. says: "Only look for the avatar if req.files actually exists."


})

export default registerUser;