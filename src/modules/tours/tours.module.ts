// src/modules/tours/tours.module.ts - APPLY forwardRef() HERE
import { Module, forwardRef } from "@nestjs/common" // <--- Import forwardRef
import { MongooseModule } from "@nestjs/mongoose"
import { ToursService } from "./tours.service"
import { ToursController } from "./tours.controller"
import { Tour, TourSchema } from "./schemas/tour.schema"
import { CountriesModule } from "../countries/countries.module" // Keep the import for CountriesModule
import { CategoriesModule } from "../categories/categories.module"

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tour.name, schema: TourSchema }]),
    forwardRef(() => CountriesModule), // <--- WRAP CountriesModule with forwardRef()
    CategoriesModule,
  ],
  controllers: [ToursController],
  providers: [ToursService],
  exports: [ToursService],
})
export class ToursModule {}