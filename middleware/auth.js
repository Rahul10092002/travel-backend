const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      // No token provided
      return res
        .status(401)
        .json({ success: false, message: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Get the token from the header

    // Attempt to verify the token as a Google token
    const googleToken = token.length > 1000;
    if (googleToken) {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      req.user = {
        id: payload.sub,
        name: payload.name,
        photoURL: payload.picture,
      };
    } else {
      // Verify the token as a JWT
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const { id, name, photoUrl } = decodedToken;
      req.user = { id, name, photoUrl };
    }

    next();
  } catch (error) {
    console.error("Error during authentication:", error);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = auth;
