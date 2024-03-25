const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");
const User = require("../models/User");
const tryCatch=require('./utils/tryCatch');
const Room = require("../models/Rooms");
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      // Check if any of the required fields is missing in the request body
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (name, email, password).",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be 6 characters or more",
      });
    }

    const emailLowerCase = email.toLowerCase();
    const existedUser = await User.findOne({ email: emailLowerCase });
    if (existedUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email: emailLowerCase,
      password: hashedPassword,
    });

    const { _id: id, photoURL, role, active } = user;
    const token = jwt.sign(
      { id, name, photoURL, role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({
      success: true,
      result: { id, name, email: user.email, photoURL, token, role, active },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Try again later",
    });
  }
};

 const login = tryCatch(async (req, res) => {
  const { email, password } = req.body;

  const emailLowerCase = email.toLowerCase();
  const existedUser = await User.findOne({ email: emailLowerCase });
  if (!existedUser)
    return res
      .status(404)
      .json({ success: false, message: "User does not exist!" });
  const correctPassword = await bcrypt.compare(password, existedUser.password);
  if (!correctPassword)
    return res
      .status(400)
      .json({ success: false, message: "Invalid credentials" });

  const { _id: id, name, photoURL} = existedUser;
  // if (!active)
  //   return res.status(400).json({
  //     success: false,
  //     message: "This account has been suspended! Try to contact the admin",
  //   });
  const token = jwt.sign({ id, name, photoURL }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.status(200).json({
    success: true,
    result: { id, name, email: emailLowerCase, photoURL, token},
  });
 });

const updateUserProfile = tryCatch(async (req, res) => {
  const updateUser = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
  });
  const { _id: id, name, photoUrl } = updateUser;
  await Room.updateMany({uid:id},{uPhoto:photoUrl})
  const token = jwt.sign({ id, name, photoUrl }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.status(200).json({ success: true, result: { name, photoUrl, token } });
});










module.exports = {register,login,updateUserProfile}

