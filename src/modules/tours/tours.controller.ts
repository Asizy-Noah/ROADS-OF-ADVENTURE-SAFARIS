// src/modules/tours/tours.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Res,
  Render,
  Query,
  UseInterceptors,
  UploadedFile,
  HttpException, 
  HttpStatus,
  UploadedFiles,
  Patch, // Import Patch for updating tours for RESTful design
  Delete, // Import Delete for deleting tours for RESTful design
} from "@nestjs/common";
import { FilesInterceptor, FileFieldsInterceptor, FileInterceptor, AnyFilesInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { ToursService } from "./tours.service";
import { CreateTourDto } from "./dto/create-tour.dto";
import { UpdateTourDto } from "./dto/update-tour.dto";
import { SessionAuthGuard } from "../auth/guards/session-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/schemas/user.schema";
import { TourStatus } from "./schemas/tour.schema";
import { getMulterConfig } from "../../config/multer.config"; 
import { CountriesService } from "../countries/countries.service";
import { CategoriesService } from "../categories/categories.service";

@Controller("tours")
export class ToursController {
  constructor(
    private readonly toursService: ToursService,
    private readonly countriesService: CountriesService,
    private readonly categoriesService: CategoriesService,
  ) {}

  @Get()
  @Render("public/tours/index")
  async getAllTours(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string = '',
    @Query('countryId') countryId: string = 'all', // For public tours filter
    @Query('categoryId') categoryId: string = 'all', // For public tours filter
    @Query('status') status: TourStatus = TourStatus.PUBLISHED, // Only published for public
  ) {
    const {
      tours,
      totalDocs,
      limit: perPageLimit,
      totalPages,
      page: currentPage,
      hasNextPage,
      hasPrevPage,
      nextPage,
      prevPage,
    } = await this.toursService.findAll({
      page,
      limit,
      search,
      country: countryId === 'all' ? undefined : countryId,
      category: categoryId === 'all' ? undefined : categoryId,
      status: status, // Ensure only published tours are fetched for the public view
    });

    const countries = await this.countriesService.findAll({});
    const categories = await this.categoriesService.findAll({});

    return {
      title: "Safari Tours - Roads of Adventure Safaris",
      tours,
      countries: countries.data, // Access .data from service response
      categories: categories.data, // Access .data from service response
      query: { page: currentPage.toString(), limit: perPageLimit.toString(), search, countryId, categoryId, status },
      pagination: {
        totalDocs,
        totalPages,
        currentPage,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
      },
      layout: "layouts/public",
    };
  }

  @Get(":slug")
  @Render("public/tours/show")
  async getTour(@Param("slug") slug: string) {
    const tour = await this.toursService.findBySlug(slug);

    // Get related tours from the same countries
    const relatedToursResult = await this.toursService.findAll({
      country: tour.countries.length > 0 ? tour.countries[0]?._id.toString() : undefined, // Pass country ID as string
      status: TourStatus.PUBLISHED,
      limit: '4', // Limit to a few related tours
    });

    // Remove the current tour from related tours
    const filteredRelatedTours = relatedToursResult.tours.filter((relatedTour) => relatedTour._id.toString() !== tour._id.toString());

    return {
      title: `${tour.title} - Roads of Adventure Safaris`,
      tour,
      relatedTours: filteredRelatedTours.slice(0, 3), // Ensure we only get 3 after filtering
      layout: "layouts/public",
      seo: {
        title: tour.seoTitle || `${tour.title} - Roads of Adventure Safaris`,
        description: tour.seoDescription || tour.overview,
        keywords: tour.seoKeywords,
        canonicalUrl: tour.seoCanonicalUrl,
        ogImage: tour.seoOgImage || tour.coverImage,
      },
    };
  }

  @Get("dashboard/tours")
  @UseGuards(SessionAuthGuard)
  @Render("dashboard/tours/index") 
  async getTours(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('search') search: string = '',
    @Query('countryId') countryId: string = 'all',
    @Query('categoryId') categoryId: string = 'all',
    @Query('status') status: TourStatus | 'all' = 'all', // Allow filtering by all statuses or specific ones
    @Req() req,
  ) {
    const filterOptions: any = {
      page,
      limit,
      search,
      country: countryId === 'all' ? undefined : countryId,
      category: categoryId === 'all' ? undefined : categoryId,
      status: status === 'all' ? undefined : status,
    };

    // If agent, only show their tours
    if (req.user.role === UserRole.AGENT) {
      filterOptions.createdBy = req.user.id;
    }

    const {
      tours,
      totalDocs,
      limit: perPageLimit,
      totalPages,
      page: currentPage,
      hasNextPage,
      hasPrevPage,
      nextPage,
      prevPage,
    } = await this.toursService.findAll(filterOptions);

    const countries = await this.countriesService.findAll({});
    const categories = await this.categoriesService.findAll({});

    return {
      title: "Tours - Dashboard",
      tours,
      countries: countries.data,
      categories: categories.data,
      user: req.user,
      query: { page: currentPage.toString(), limit: perPageLimit.toString(), search, countryId, categoryId, status },
      pagination: {
        totalDocs,
        totalPages,
        currentPage,
        hasNextPage,
        hasPrevPage,
        nextPage,
        prevPage,
      },
      layout: "layouts/dashboard",
      tourStatuses: Object.values(TourStatus), // Pass available statuses to EJS for dropdown
    };
  }

  @Get("dashboard/tours/add")
  @UseGuards(SessionAuthGuard)
  @Render("dashboard/tours/add")
  async getAddTourPage(@Req() req) {
    const countries = await this.countriesService.findAll({});
    const categories = await this.categoriesService.findAll({});

    return {
      title: "Add Tour - Dashboard",
      countries: countries.data, // Pass data property
      categories: categories.data, // Pass data property
      user: req.user,
      layout: "layouts/dashboard",
    };
  }

  @Post("dashboard/tours/add")
  @UseGuards(SessionAuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor([ // This interceptor will handle all your file fields
    { name: 'coverImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 10 },
  ], getMulterConfig('tours'))
  )
  async addTour(
    @Body() createTourDto: CreateTourDto,
    @UploadedFiles() uploadedFiles: { coverImage?: Express.Multer.File[], galleryImages?: Express.Multer.File[] },
    @Req() req,
    @Res() res: Response,
  ) {
    try {
      // --- START: Missing logic for processing files and DTO ---
      const newCoverImageFile = uploadedFiles.coverImage ? uploadedFiles.coverImage[0] : null;
      const newGalleryImageFiles = uploadedFiles.galleryImages || [];
  
      if (newCoverImageFile) {
      // FIX HERE: Include '/tours/' in the path
      createTourDto.coverImage = `/uploads/tours/${newCoverImageFile.filename}`;
    } else if (createTourDto.coverImage === '') {
      createTourDto.coverImage = null;
    }

    if (newGalleryImageFiles.length > 0) {
      // FIX HERE: Include '/tours/' in the path for each gallery image
      createTourDto.galleryImages = newGalleryImageFiles.map((file) => `/uploads/tours/${file.filename}`);
    } else if (!createTourDto.galleryImages) {
        createTourDto.galleryImages = [];
    }
  
      // Prepare tour data for saving, handling country and category IDs
      const tourDataToSave: any = { // Declared tourDataToSave here
        ...createTourDto,
        // Convert country and category IDs to array of strings if they are single string
        countries: createTourDto.country ? [createTourDto.country] : [],
        categories: createTourDto.category ? [createTourDto.category] : [],
      };
      // Remove the singular properties if your DB schema only uses the plural arrays
      delete tourDataToSave.country;
      delete tourDataToSave.category;
      // --- END: Missing logic ---
  
      await this.toursService.create(tourDataToSave, req.user.id);
  
      req.flash("success_msg", "Tour added successfully");
      return res.redirect("/tours/dashboard/tours");
    } catch (error) {
      console.error('Error adding tour:', error);
  
      let flashMessage = "Failed to add tour.";
  
      if (error instanceof HttpException) {
        const response = error.getResponse();
        if (typeof response === 'object' && response !== null && 'message' in response) {
          if (Array.isArray(response.message)) {
            flashMessage = response.message.join(', ');
          } else {
            flashMessage = response.message as string;
          }
        } else if (typeof response === 'string') {
          flashMessage = response;
        } else {
          flashMessage = error.message || "An unknown error occurred.";
        }
      } else if (error.message) {
        flashMessage = error.message;
      }
  
      req.flash("error_msg", flashMessage);
      req.flash('oldInput', createTourDto);
  
      return res.redirect("/tours/dashboard/tours/add");
    }
  }
  

  @Get("dashboard/tours/edit/:id")
  @UseGuards(SessionAuthGuard)
  @Render("dashboard/tours/edit")
  async getEditTourPage(@Param("id") id: string, @Req() req, @Res({ passthrough: true }) res: Response) {
    try {
      const tour = await this.toursService.findOne(id);
      const countries = await this.countriesService.findAll({});
      const categories = await this.categoriesService.findAll({});

      // Check if user is authorized to edit this tour
      if (req.user.role === UserRole.AGENT && tour.createdBy.toString() !== req.user.id) {
        req.flash("error_msg", "You are not authorized to edit this tour");
        return res.redirect("/tours/dashboard/tours");
      }

      return {
        title: "Edit Tour - Dashboard",
        tour,
        countries: countries.data,
        categories: categories.data,
        user: req.user,
        layout: "layouts/dashboard",
        messages: req.flash(),
      };
    } catch (error) {
      console.error('Error fetching tour for edit:', error);
      req.flash("error_msg", error.message || "Failed to load tour for editing.");
      return res.redirect("/tours/dashboard/tours");
    }
  }

  @Patch("dashboard/tours/edit/:id") // Corrected path relative to controller base
  @UseGuards(SessionAuthGuard)
  @UseInterceptors(
    // *** FIX IS HERE: Use FileFieldsInterceptor to specify exact field names ***
    FileFieldsInterceptor([ // This interceptor will handle all your file fields
    { name: 'coverImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 10 },
  ], getMulterConfig('tours'))
  )
  async updateTour(
    @Param("id") id: string,
    @Body() updateTourDto: UpdateTourDto,
    // *** FIX IS HERE: Adjust the type for @UploadedFiles to match FileFieldsInterceptor's output ***
    @UploadedFiles() uploadedFiles: { coverImage?: Express.Multer.File[], galleryImages?: Express.Multer.File[] },
    @Req() req,
    @Res() res: Response,
  ) {
    try {
      const tour = await this.toursService.findOne(id);

      if (!tour) {
        req.flash("error_msg", "Tour not found.");
        return res.redirect("/dashboard/tours");
      }

      if (req.user.role === UserRole.AGENT && tour.createdBy.toString() !== req.user.id) {
        req.flash("error_msg", "You are not authorized to edit this tour");
        return res.redirect("/dashboard/tours");
      }

      // --- Handle uploaded files ---
      // Access the files directly from the typed uploadedFiles object
      const newCoverImageFile = uploadedFiles.coverImage ? uploadedFiles.coverImage[0] : null;
      const newGalleryImageFiles = uploadedFiles.galleryImages || [];

      // Handle cover image update logic
      if (newCoverImageFile) {
        updateTourDto.coverImage = `/uploads/tours/${newCoverImageFile.filename}`;
        // Delete old cover image if it exists and is not also a gallery image
        // (Add logic to delete old file from disk if needed)
      } else if (updateTourDto.coverImage === '') {
        // If the form sent an empty string for coverImage, it means user removed the cover image.
        updateTourDto.coverImage = null; // Or undefined, based on your schema
        // Delete old cover image file from disk (if it's not part of gallery and needs deletion)
      }
      // If newCoverImageFile is null and updateTourDto.coverImage is not empty string,
      // it means the user didn't upload a new one and didn't explicitly remove it, so keep the old one.


      // Handle gallery images:
      let currentGalleryImages = tour.galleryImages || [];

      // 1. Filter out removed gallery images from the existing ones
      if (updateTourDto.removedGalleryImages && Array.isArray(updateTourDto.removedGalleryImages)) {
          // Assuming updateTourDto.removedGalleryImages contains full paths like '/uploads/abc.jpg'
          currentGalleryImages = currentGalleryImages.filter(img => !updateTourDto.removedGalleryImages.includes(img));
      }

      // 2. Add newly uploaded gallery images
      const uploadedGalleryPaths = newGalleryImageFiles.map((file) => `/uploads/tours/${file.filename}`);
      updateTourDto.galleryImages = [...currentGalleryImages, ...uploadedGalleryPaths];


      // --- Handle other DTO fields ---
      // Ensure countries and categories are handled as arrays of strings (ObjectIds)
      // Assuming your Mongoose schema still expects `countries: [String]` and `categories: [String]`
      const tourDataToUpdate: any = { // Use 'any' temporarily if DTO structure doesn't perfectly match
        ...updateTourDto,
        countries: updateTourDto.country ? (Array.isArray(updateTourDto.country) ? updateTourDto.country : [updateTourDto.country]) : [],
        categories: updateTourDto.category ? (Array.isArray(updateTourDto.category) ? updateTourDto.category : [updateTourDto.category]) : [],
      };
      // Remove the singular properties if the DB schema only uses the plural arrays
      delete tourDataToUpdate.country;
      delete tourDataToUpdate.category;


      await this.toursService.update(id, tourDataToUpdate, req.user.id);

      req.flash("success_msg", "Tour updated successfully");
      return res.redirect("/tours/dashboard/tours");
    } catch (error) {
      console.error('Error updating tour:', error);
      req.flash("error_msg", error.message || "Failed to update tour.");
      return res.redirect(`/dashboard/tours/edit/${id}`);
    }
  }


  // Changed to DELETE for more RESTful deletion
  @Delete("dashboard/tours/:id") // Using :id directly for deletion
  @UseGuards(SessionAuthGuard)
  async deleteTour(@Param("id") id: string, @Req() req, @Res({ passthrough: true }) res: Response) {
    try {
      const tour = await this.toursService.findOne(id); // Fetch tour for authorization

      // Check if user is authorized to delete this tour
      if (req.user.role === UserRole.AGENT && tour.createdBy.toString() !== req.user.id) {
        req.flash("error_msg", "You are not authorized to delete this tour");
        return res.redirect("/tours/dashboard/tours");
      }

      await this.toursService.remove(id);

      req.flash("success_msg", "Tour deleted successfully");
      return res.redirect("/tours/dashboard/tours");
    } catch (error) {
      console.error('Error deleting tour:', error);
      req.flash("error_msg", error.message || "Failed to delete tour.");
      return res.redirect("/tours/dashboard/tours");
    }
  }

  // Status update (Consider changing to PATCH for RESTful design)
  @Patch("dashboard/tours/:id/status/:status")
  @UseGuards(SessionAuthGuard)
  async updateTourStatus(
    @Param("id") id: string,
    @Param("status") status: TourStatus,
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    try {
      const tour = await this.toursService.findOne(id);

      // Check if user is authorized to update this tour
      if (req.user.role === UserRole.AGENT && tour.createdBy.toString() !== req.user.id) {
        req.flash("error_msg", "You are not authorized to update this tour");
        return res.redirect("/tours/dashboard/tours");
      }

      await this.toursService.updateStatus(id, status, req.user.id);

      req.flash("success_msg", `Tour status updated to ${status}`);
      return res.redirect("/tours/dashboard/tours");
    } catch (error) {
      console.error('Error updating tour status:', error);
      req.flash("error_msg", error.message || "Failed to update tour status.");
      return res.redirect("/tours/dashboard/tours");
    }
  }

  @Patch("dashboard/tours/:id/featured") // Changed to PATCH for RESTful design
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async toggleFeatured(@Param("id") id: string, @Req() req, @Res({ passthrough: true }) res: Response) {
    try {
      await this.toursService.toggleFeatured(id, req.user.id);

      req.flash("success_msg", "Tour featured status toggled successfully");
      return res.redirect("/tours/dashboard/tours");
    } catch (error) {
      console.error('Error toggling featured status:', error);
      req.flash("error_msg", error.message || "Failed to toggle featured status.");
      return res.redirect("/tours/dashboard/tours");
    }
  }
}