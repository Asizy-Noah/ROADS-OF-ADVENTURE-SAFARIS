// src/modules/tours/tours.module.ts
import { Module, forwardRef } from "@nestjs/common"; // Keep forwardRef
import { MongooseModule } from "@nestjs/mongoose";
import { ToursService } from "./tours.service";
import { ToursController } from "./tours.controller";
import { Tour, TourSchema } from "./schemas/tour.schema";
// Re-import these modules:
import { CountriesModule } from "../countries/countries.module"; // <--- UNCOMMENT/ADD
import { CategoriesModule } from "../categories/categories.module"; // <--- UNCOMMENT/ADD

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tour.name, schema: TourSchema }]),
    // Apply forwardRef to both CountriesModule and CategoriesModule because ToursModule
    // is part of the circular dependency with both of them.
    forwardRef(() => CountriesModule), // <--- Re-add with forwardRef
    forwardRef(() => CategoriesModule), // <--- Re-add with forwardRef
  ],
  controllers: [ToursController],
  providers: [ToursService],
  exports: [ToursService], // Ensure ToursService is exported
})
export class ToursModule {}