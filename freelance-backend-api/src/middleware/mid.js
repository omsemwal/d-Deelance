const mongoose= require("mongoose")
const jwt = require("jsonwebtoken")
const User= require("../model/userModel")

const getUserFromToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return decoded.id;
  } catch (error) {
    return null;
  }
};

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).send("No token provided");
  }

  const userId = getUserFromToken(token);
  if (!userId) {
    return res.status(401).send("Invalid token");
  }

  req.userId = userId;
  next();
};




const token = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).send({ status: false, msg: "Invalid Token" });
    }
    const token = authHeader.replace("Bearer ", "");
    console.log(token);
    const decodedToken = jwt.verify(token, "secret_key");
    console.log(decodedToken);
    if (!decodedToken) {
      return res
        .status(401)
        .send({ status: false, msg: "Decoded token not matched" });
    }
    const user = await User.findById(decodedToken._id).select();
    if (!user) {
      return res
        .status(401)
        .send({ status: false, msg: "Invalid access token" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).send({ message: "Server error", error: error });
  }
};

module.exports={token,authenticate}