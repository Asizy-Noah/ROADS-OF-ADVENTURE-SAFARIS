import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { BlogsService } from "./blogs.service"
import { BlogsController } from "./blogs.controller"
import { Blog, BlogSchema } from "./schemas/blog.schema"
import { MailModule } from "../mail/mail.module"
import { SubscribersModule } from "../subscribers/subscribers.module"
import { CountriesModule } from "../countries/countries.module" // <--- ADD THIS IMPORT
import { CategoriesModule } from "../categories/categories.module" // <--- ADD THIS IMPORT
import { ToursModule } from '../tours/tours.module';
import { GoogleCloudStorageService } from '../google-cloud/google-cloud-storage.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
    MailModule,
    SubscribersModule,
    CountriesModule, // <--- ADD CountriesModule here
    CategoriesModule,
    ToursModule, // <--- ADD CategoriesModule here
  ],
  controllers: [BlogsController],
  providers: [BlogsService, GoogleCloudStorageService,],
  exports: [BlogsService],
})
export class BlogsModule {}