const jwt = require("jsonwebtoken");



const verifyUser =async (req,res,next) =>{
   
    try{
        const header = req.headers["authorization"];

        const jwtToken = header.split("")[1];

          jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decoded) => {
                    if (err) {
                        return res.status(401).json({ message: "Access Denied" });
                    }
                    req.USERID = decoded.UserId;
                    next();
                });

    }catch(err){
    console.log(err);
    res.status(500).json({message:"Login Failed ",err});
    }

}

module.exports = {verifyUser};