const notFound = (req, res, next) => {
  const error = new Error("Not Found - " + req);
  // console.log(req);
  res.status(400);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  // if(res.statusCode === 200)=> statusCode = 500 else statusCode = res.statusCode
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.send({
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? null : error.stack,
  });
};

module.exports = { notFound, errorHandler };
