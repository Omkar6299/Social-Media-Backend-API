const invalidRoutes = (req,res,next) => {
    res
    .status(404)
    .json({ success: false, msg: `Invalid path: ${req.originalUrl} - Please check api documentation localhost:8081/api-docs` });
  next();
}

export default invalidRoutes;