// src/modules/tours/tours.module.ts
import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ToursService } from "./tours.service";
import { ToursController } from "./tours.controller";
import { Tour, TourSchema } from "./schemas/tour.schema";
import { CountriesModule } from "../countries/countries.module";
import { CategoriesModule } from "../categories/categories.module";
import { GoogleCloudStorageService } from "../google-cloud/google-cloud-storage.service"; // <--- IMPORT GCS SERVICE

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tour.name, schema: TourSchema }]),
    forwardRef(() => CountriesModule),
    forwardRef(() => CategoriesModule),
  ],
  controllers: [ToursController],
  providers: [
    ToursService,
    GoogleCloudStorageService, 
  ],
  exports: [ToursService],
})
export class ToursModule {}