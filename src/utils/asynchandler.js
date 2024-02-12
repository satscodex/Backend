// const asyncHandler=()=>{

// }

const asyncHandler=(fn)=>{async(req,res,next)=>{
      try {
        await fn(req,res,next)
      } catch (error) {
        res.status(300).json({status:'failed',err:error.message})
      }
}}

export {asyncHandler};