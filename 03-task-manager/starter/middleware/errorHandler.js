const errorHandler = (err, req, res, next) => {
  return res.status(err.status).json({ msg: err.message });
};
module.exports = { errorHandler };

// async function asyncWrapper(req,res,next,fn){
//     try{
//     await fn(req,res)
//     }catch(e){
//         errorHandler(e); //next middleware
//     }
// }
