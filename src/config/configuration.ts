export default () => ({
    port: Number.parseInt(process.env.PORT, 10) || 3000,
    database: {
      uri: process.env.MONGODB_URI,
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    },
    session: {
      secret: process.env.SESSION_SECRET,
    },
    upload: {
      destination: process.env.UPLOAD_DESTINATION || "./uploads",
    },
    email: {
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: Number.parseInt(process.env.EMAIL_PORT, 10) || 587,
      user: process.env.EMAIL_USER,
      password: process.env.EMAIL_PASSWORD,
      from: process.env.EMAIL_FROM || "asiomizunoah@gmail.com", 
    },
  })
  