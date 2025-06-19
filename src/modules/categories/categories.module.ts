// src/modules/categories/categories.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category, CategorySchema } from './schemas/category.schema';
import { CountriesModule } from '../countries/countries.module';
import { CategoriesApiController } from './categories.api.controller';
import { ToursModule } from '../tours/tours.module';
import { CategoriesPublicController } from './categories-public.controller';
import { GoogleCloudStorageService } from "../google-cloud/google-cloud-storage.service"; // <--- IMPORT GCS SERVICE

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    forwardRef(() => CountriesModule),
    forwardRef(() => ToursModule), // ❗ Keep this wrapped in forwardRef for circular dependency
  ],
  controllers: [CategoriesController, CategoriesApiController, CategoriesPublicController],
  providers: [
    CategoriesService,
    GoogleCloudStorageService, // <--- ADD GCS SERVICE TO PROVIDERS
  ],
  exports: [CategoriesService],
})
export class CategoriesModule {}