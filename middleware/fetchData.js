const jwt = require('jsonwebtoken');
const J_W_T = 'muhammadmudasiirisgood$oy'
const fetchData =(req, res, next)=>{
const token = req.header('auth-token')
try {
    if(!token){
        res.status(401).json({"error": "please authenticate with valid token"})
    }
    const data = jwt.verify(token, J_W_T) 
     req.user = data.user
     next()
    } catch (err) {
        res.status(401).json({"error": "please authenticate with valid token"})
}
}


module.exports = fetchData