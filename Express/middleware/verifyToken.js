const jwt = require("jsonwebtoken");

const verify = (req, res, next) => {
      const authHeader = req.headers["authorization"];

      try {
            if (!authHeader) {
                  return res.status(401).json({ message: "Missing Authorization header" });
            }

            // Support both raw token and 'Bearer <token>' header formats
            // const token = typeof authHeader === 'string' && authHeader.startsWith('Bearer ')
            //       ? authHeader.split(' ')[1]
            //       : authHeader;

            jwt.verify(authHeader, "Key123", (err, decoded) => {
                  if (err) {
                        console.log(err);
                        return res.status(403).json({ message: "Invalid or expired token" });
                  }else{
                  
                  req.userID = decoded.userID;
                  console.log(req.userID);
                  next();
                  }
               
            });
      } catch (err) {
            console.log(err);
            res.status(500).json({ message: "error", err });
      }
};

module.exports = { verify };