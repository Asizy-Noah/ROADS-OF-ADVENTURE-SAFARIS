// src/modules/countries/countries.module.ts
import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CountriesService } from "./countries.service";
import { CountriesController } from "./countries.controller";
import { Country, CountrySchema } from "./schemas/country.schema";
import { ToursModule } from "../tours/tours.module"; // Still imports ToursModule
import { CategoriesModule } from '../categories/categories.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }]),
    ToursModule, // Direct import, as ToursModule uses forwardRef for CountriesModule
    forwardRef(() => CategoriesModule), // forwardRef here for CategoriesModule
  ],
  controllers: [CountriesController],
  providers: [CountriesService],
  exports: [CountriesService],
})
export class CountriesModule {}