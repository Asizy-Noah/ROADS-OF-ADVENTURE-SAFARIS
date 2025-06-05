// src/modules/categories/categories.api.controller.ts
import { Controller, Get, Param, Query } from "@nestjs/common";
import { CategoriesService } from "./categories.service";

@Controller("api/categories") // Base route for the API endpoints
export class CategoriesApiController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get("country/:countryId")
  async getCategoriesByCountry(@Param("countryId") countryId: string) {
    // Pass countryId inside an object as expected by findAll
    // The service now accepts `countryId` in its query options
    const categoriesResult = await this.categoriesService.findAll({ countryId: countryId, limit: '1000' }); // Pass a large limit to get all
    return categoriesResult.data; // Return just the array of categories (now named 'data')
  }

  @Get()
  async getAllCategoriesApi(
    @Query("page") page: string = "1",
    @Query("limit") limit: string = "10",
    @Query("search") search: string,
    @Query("countryId") countryId: string = "all", // This allows filtering by country directly on the /api/categories route
  ) {
    const categoriesResult = await this.categoriesService.findAll({ page, limit, search, countryId });
    // You might want to return the full pagination object here for API consumers
    return categoriesResult;
  }
}