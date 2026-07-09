import jwt from "jsonwebtoken";
export const verifyToken = async (token: string, secret: string) => {
  try {
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    return {
      success: true,
      message: "Token is valid",
      payload: decoded,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Token is invalid",
    };
  }
};
