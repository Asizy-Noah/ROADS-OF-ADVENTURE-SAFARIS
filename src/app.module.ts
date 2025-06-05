import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { ServeStaticModule } from "@nestjs/serve-static"
import { join } from "path"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { AuthModule } from "./modules/auth/auth.module"
import { UsersModule } from "./modules/users/users.module"
import { CountriesModule } from "./modules/countries/countries.module"
import { CategoriesModule } from "./modules/categories/categories.module"
import { ToursModule } from "./modules/tours/tours.module"
import { BlogsModule } from "./modules/blogs/blogs.module"
import { ReviewsModule } from "./modules/reviews/reviews.module"
import { SubscribersModule } from "./modules/subscribers/subscribers.module"
import { PagesModule } from "./modules/pages/pages.module"
import { BookingsModule } from "./modules/bookings/bookings.module"
import { MailModule } from "./modules/mail/mail.module"
import { DashboardModule } from "./modules/dashboard/dashboard.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI") || "mongodb://localhost/roads-of-adventure",
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "public"),
    }),
    AuthModule,
    UsersModule,
    CountriesModule,
    CategoriesModule,
    ToursModule,
    BlogsModule,
    ReviewsModule,
    SubscribersModule,
    PagesModule,
    BookingsModule,
    MailModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
