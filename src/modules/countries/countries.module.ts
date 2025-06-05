import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { CountriesService } from "./countries.service"
import { CountriesController } from "./countries.controller"
import { Country, CountrySchema } from "./schemas/country.schema"
import { ToursModule } from "../tours/tours.module"

@Module({
  imports: [MongooseModule.forFeature([{ name: Country.name, schema: CountrySchema }]), ToursModule],
  controllers: [CountriesController],
  providers: [CountriesService],
  exports: [CountriesService],
})
export class CountriesModule {}
