// src/modules/categories/categories.module.ts

import { Module, forwardRef } from '@nestjs/common'; // Import forwardRef
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { Category, CategorySchema } from './schemas/category.schema';
import { CountriesModule } from '../countries/countries.module'; // This is the module that causes the circular dep
import { CategoriesApiController } from './categories.api.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }]),
    forwardRef(() => CountriesModule), // <--- Apply forwardRef here
  ],
  controllers: [CategoriesController, CategoriesApiController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}