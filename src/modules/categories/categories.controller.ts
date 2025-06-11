// src/modules/categories/categories.controller.ts
import {
  Controller,
  Get,
  Render,
  Post,
  Put,
  Body,
  ValidationPipe,
  Req,
  Res,
  UseGuards,
  Param,
  Delete,
  Patch,
  Query,
  UseInterceptors, // <--- Ensure these are imported if using Multer
  UploadedFile, 
} from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express'; 
import { Response } from "express";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/schemas/user.schema";
import { SessionAuthGuard } from "../auth/guards/session-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CountriesService } from "../countries/countries.service"; // Import CountriesService
import { diskStorage } from 'multer'; // <--- Ensure these are imported if using Multer
import { extname } from 'path';

@Controller('categories') // Base route for dashboard categories
@UseGuards(SessionAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.AGENT) // Adjust roles as needed
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly countriesService: CountriesService, // Inject CountriesService
  ) {}

  @Get('dashboard')
  @Render('dashboard/categories/index')
  async getCategories(
    @Req() req,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string,
    @Query('countryId') countryId: string = "all", // Add countryId to query params
  ) {
    const currentPage = parseInt(page, 10);
    const perPageLimit = parseInt(limit, 10);

    const findCategoriesOptions: any = { page: currentPage.toString(), limit: perPageLimit.toString() };
    if (search) findCategoriesOptions.search = search;
    if (countryId && countryId !== "all") findCategoriesOptions.countryId = countryId; // Pass countryId to service

    const {
      data: categories, // Renamed 'categories' to 'data'
      total: totalDocs, // Renamed 'total' to 'totalDocs' for consistency with ToursService
      limit: resLimit, // Use resLimit to avoid naming conflict with perPageLimit
      totalPages,
      page: resPage, // Use resPage to avoid naming conflict with currentPage
    } = await this.categoriesService.findAll(findCategoriesOptions);

    // Calculate hasNextPage, hasPrevPage, nextPage, prevPage based on returned data
    const hasNextPage = resPage < totalPages;
    const hasPrevPage = resPage > 1;
    const nextPage = hasNextPage ? resPage + 1 : null;
    const prevPage = hasPrevPage ? resPage - 1 : null;

    const allCountriesResult = await this.countriesService.findAll({}); // Fetch all countries
    const countries = allCountriesResult.data; // Extract data from countries result

    return {
      title: 'Categories - Dashboard',
      categories,
      countries, // Pass countries to the view for filtering dropdown
      user: req.user,
      query: { page: currentPage.toString(), limit: perPageLimit.toString(), search, countryId }, // Pass countryId in query
      pagination: {
        totalDocs,
        limit: resLimit,
        totalPages,
        page: resPage,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
      },
      messages: req.flash(),
      layout: 'layouts/dashboard',
    };
  }

  @Get('dashboard/add')
  @Render('dashboard/categories/add')
  async getAddCategoryPage(@Req() req) {
    const allCountriesResult = await this.countriesService.findAll({});
    const countries = allCountriesResult.data;
    const body = {};
    return {
      title: 'Add Category - Dashboard',
      layout: 'layouts/dashboard',
      countries, // Pass countries to the view for selection
      user: req.user,
      messages: req.flash(), 
      body,
    };
  }



@Post('dashboard/add')
@UseInterceptors(
    FileInterceptor('image', { // 'image' is the name attribute of your file input: <input type="file" name="image">
      storage: diskStorage({
        destination: './public/uploads/categories', // Adjust your upload path
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit
      }
    })
)
async addCategory(
    @Body(ValidationPipe) createCategoryDto: CreateCategoryDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
) {

    // *** FIX IS HERE: Use req.user.id instead of req.user._id ***
    // Remove the redundant check if your guard is strictly enforcing authentication
    // If you want to keep a check for robustness (e.g., if somehow a user gets through without an ID):
    if (!req.user || !req.user.id) { // Check for req.user.id instead of req.user._id
        
        req.flash('error_msg', 'You must be logged in to add a category.');
        return res.redirect('/auth/login'); // Or your actual login route
    }

    try {
        

        if (file) {
            createCategoryDto.image = `/uploads/categories/${file.filename}`;
        } else {
            // If image is optional and not provided, ensure it's not set to an empty string if not needed
            // This line is fine if you want to explicitly remove the 'image' property if no file uploaded
            delete createCategoryDto.image;
        }

        // *** FIX IS HERE: Use req.user.id instead of req.user._id ***
        const userId = req.user.id.toString(); // This should now work correctly
        const newCategory = await this.categoriesService.create(createCategoryDto, userId);
        req.flash('success_msg', 'Category added successfully!');
        return res.redirect('/categories/dashboard');
    } catch (error) {
        
        req.flash('error_msg', error.message || 'Failed to add category.');

        const allCountriesResult = await this.countriesService.findAll({});
        const countries = allCountriesResult.data;

        return res.render('dashboard/categories/add', {
            title: 'Add Category - Dashboard',
            countries,
            user: req.user,
            layout: 'layouts/dashboard',
            messages: req.flash(),
            oldInput: createCategoryDto,
        });
    }
}


  @Get('dashboard/edit/:id')
  @Render('dashboard/categories/edit')
  async getEditCategoryPage(@Param('id') id: string, @Req() req, @Res({ passthrough: true }) res: Response) {
    try {
      const category = await this.categoriesService.findOne(id);
      const allCountriesResult = await this.countriesService.findAll({});
      const countries = allCountriesResult.data;

      // Authorization check: Agents can only edit categories they created (if applicable, otherwise remove)
      const user = req.user as any;
      if (user.role === UserRole.AGENT && category.createdBy.toString() !== user._id.toString()) {
        req.flash('error', 'You are not authorized to edit this category.');
        return res.redirect('/dashboard/categories');
      }

      return {
        title: 'Edit Category - Dashboard',
        category,
        countries,
        user: req.user,
        layout: 'layouts/dashboard',
        messages: req.flash(),
      };
    } catch (error) {
      console.error('Error fetching category for edit:', error);
      req.flash('error', error.message || 'Category not found or an error occurred.');
      return res.redirect('/dashboard/categories');
    }
  }

  @Put('dashboard/edit/:id')
@UseInterceptors(FileInterceptor('image', { /* ... multer options ... */ }))
async updateCategory(
  @Param('id') id: string,
  @Body(ValidationPipe) updateCategoryDto: UpdateCategoryDto,
  @UploadedFile() file: Express.Multer.File,
  @Req() req: any,
  @Res({ passthrough: true }) res: Response,
) {
  

  if (!req.user || !req.user.id) {
    req.flash('error_msg', 'You must be logged in to update a category.');
    return res.redirect('/auth/login');
  }

  try {
    if (file) {
      updateCategoryDto.image = `/uploads/categories/${file.filename}`;
    } else if (updateCategoryDto.image === '') {
      updateCategoryDto.image = null; // Or undefined, depending on your schema/DTO
    }

    // Get userId from req.user.id (already confirmed to be present)
    const userId = req.user.id.toString(); // Convert to string if it's an ObjectId object

    // Pass the userId as the third argument
    const updatedCategory = await this.categoriesService.update(id, updateCategoryDto, userId); // <--- ADD userId HERE
    req.flash('success_msg', 'Category updated successfully!');
    return res.redirect('/categories/dashboard');
  } catch (error) {
    
    req.flash('error_msg', error.message || 'Failed to update category.');

    const allCountriesResult = await this.countriesService.findAll({});
    const countries = allCountriesResult.data;

    return res.render('dashboard/categories/edit', {
      title: 'Edit Category - Dashboard',
      category: { _id: id, ...updateCategoryDto },
      countries,
      user: req.user,
      layout: 'layouts/dashboard',
      messages: req.flash(),
      oldInput: updateCategoryDto,
    });
  }
}

  @Delete('dashboard/delete/:id')
  async deleteCategory(@Param('id') id: string, @Req() req, @Res() res: Response) { // Remove { passthrough: true } from @Res()
    try {
      const user = req.user as any;
      const existingCategory = await this.categoriesService.findOne(id);

      // Authorization check
      if (user.role === UserRole.AGENT && existingCategory.createdBy.toString() !== user._id.toString()) {
        req.flash('error_msg', 'You are not authorized to delete this category.'); // Use consistent flash key
        // For a DELETE request that expects a redirect, return a JSON status and let frontend handle it,
        // OR change the route to a POST if it's a form submission, for direct server-side redirect.
        // For now, let's assume this is called via fetch/axios from frontend.
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }

      await this.categoriesService.remove(id);
      req.flash('success_msg', 'Category deleted successfully!'); // Use consistent flash key

      // --- CHANGE IS HERE ---
      // For a successful DELETE operation, redirect back to the categories list.
      // If this DELETE is called via AJAX (fetch/axios) from the frontend,
      // the frontend JavaScript will need to handle this redirect.
      // If it's a direct form submission, you'd typically use a POST route for delete.
      return res.redirect('/categories/dashboard'); // Redirect to the categories list page
      // --- END CHANGE ---

    } catch (error) {
      console.error('Error deleting category:', error);
      req.flash('error_msg', error.message || 'Failed to delete category.'); // Use consistent flash key
      // If an error occurs, you might still want to redirect but ensure the flash message is seen.
      // Or return an error JSON if this is an AJAX call.
      return res.status(500).json({ success: false, message: error.message || 'Failed to delete category' });
    }
  }
}