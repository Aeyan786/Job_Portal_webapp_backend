import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const authentication = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(400).json({
        message: "Session is expired, LogIn again",
      });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).json({
        message: "token not found",
      });
    }
    req.id = decode.userId;
    next();
  } catch (error) {
    console.log(error);
  }
};

export default authentication;
