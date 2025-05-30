import jwt from "jsonwebtoken";
import userModel from "../Model/userModel.js";

function authenticateUser(req, res, next) {
  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "JWT"
  ) {
    jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_SECRET,
      async function (err, verifiedToken) {
        if (err) {
          return res.status(403).json({ message: "Invalid JWT token" });
        }
        try {
          const user = await userModel.findById(verifiedToken.id);
          if (!user) {
            return res.status(404).json({ message: "User not found" });
          }
          req.user = user;
          next();
        } catch (error) {
          return res.status(500).json({ message: error.message });
        }
      }
    );
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
}

export default authenticateUser;
