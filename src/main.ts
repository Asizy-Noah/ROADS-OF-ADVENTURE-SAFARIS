// src/main.ts
import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import session from "express-session";
import passport from "passport";
import flash from "connect-flash";
import expressLayouts from "express-ejs-layouts";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import crypto from "crypto"; // For generating a default secret
import methodOverride from 'method-override'; // <--- Change this
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Enable proxy trust (important for production deployments behind reverse proxies)
  app.set("trust proxy", 1);

  // Set up EJS templating engine
  app.setBaseViewsDir(join(__dirname, "..", "views"));
  app.setViewEngine("ejs");
  app.use(expressLayouts);
  app.set("layout", "layouts/public");

  // Session middleware (must come before passport initialization)
  app.use(
    session({
      secret:
        configService.get<string>("SESSION_SECRET") ||
        crypto.randomUUID(), // fallback to a secure random UUID
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        secure: process.env.NODE_ENV === "production", // Only over HTTPS in production
        httpOnly: true, // Prevent access via JavaScript
        sameSite: "lax", // Helps mitigate CSRF
      },
    })
  );

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Recommended: removes properties not defined in the DTO
    forbidNonWhitelisted: true, // Recommended: throws error if non-whitelisted properties are sent
    transform: true, // Recommended: automatically transforms incoming payload to DTO instance
  }));

  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  // Static files
  app.useStaticAssets(join(__dirname, "..", "public"));

  // Serve files from the 'uploads' directory at the '/uploads' path
  
  app.useStaticAssets(join(__dirname, "..", "uploads"), {
    prefix: '/uploads', // Files in 'uploads' will be accessed via /uploads/filename.jpg
  });
  // ------------------------------------------

  // Flash messages
  app.use(flash());

  // Middleware to pass user and flash messages to views
  app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error");
    res.locals.user = req.session?.user || null;
    next();
  });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json()); // Also good practice if you expect JSON bodies too

  
  app.use(methodOverride('_method')); 

  
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  // Enable this in production once verified
  // app.useGlobalFilters(new AllExceptionsFilter(), new HttpExceptionFilter());
  // app.use(LoggerMiddleware);

  const port = configService.get<number>("PORT") || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
