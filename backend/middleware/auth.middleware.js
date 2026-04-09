import jwt from "jsonwebtoken";
import userModel from "../models/user.model";
export const auth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({
        message: "No Token",
        success: false,
      });
    }

    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Invalid Token",
        success: false,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    // add this check
    if (!user.isActive) {
      return res.status(403).json({
        message: "Your account has been deactivated",
        success: false,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Token",
      success: false,
    });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role == "admin") {
    next();
  } else {
    res.status(401).json({
      message: "you dont have access!",
      success: false,
    });
  }
};
