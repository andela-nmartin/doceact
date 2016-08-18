module.exports= {
  isDevelopment: !process.env.NODE_ENV || process.env.NODE_ENV === 'development',
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongodb: {
    url: process.env.MONGODB_URL
  }
};
