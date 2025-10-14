export const protect = (req,res,next)=>{
const authToken = req.headers.authorization
console.log(authToken)
if(!authToken){
    res.status(400).send({msg:'Token not found'})
}else{
        next()
}
}

export const adminOnly = (req,res,next)=>{


    next()
}