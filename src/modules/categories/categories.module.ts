// src/modules/categories/categories.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category, CategorySchema } from './schemas/category.schema';
import { CountriesModule } from '../countries/countries.module';
import { CategoriesApiController } from './categories.api.controller';
import { ToursModule } from '../tours/tours.module'; // Still imports ToursModule directly
import { CategoriesPublicController } from './categories-public.controller'; // If you're using this

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    forwardRef(() => CountriesModule),
    forwardRef(() => ToursModule), // ❗ Wrap this in forwardRef
  ],
  controllers: [CategoriesController, CategoriesApiController, CategoriesPublicController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
