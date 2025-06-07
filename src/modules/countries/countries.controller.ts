import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Req,
  Res,
  Render,
  Query,
  HttpException, // Ensure HttpException is imported for error handling
  HttpStatus,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common"
import { FilesInterceptor, FileInterceptor, FileFieldsInterceptor } from "@nestjs/platform-express"
import { Response } from "express"
import { CountriesService } from "./countries.service"
import type { CreateCountryDto } from "./dto/create-country.dto"
import type { UpdateCountryDto } from "./dto/update-country.dto"
import { SessionAuthGuard } from "../auth/guards/session-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { UserRole } from "../users/schemas/user.schema"
import { getMulterConfig } from "../../config/multer.config";
import { ToursService } from "../tours/tours.service"
import { CategoriesService } from '../categories/categories.service';

@Controller("countries")
export class CountriesController {
  constructor(
    private readonly countriesService: CountriesService,
    private readonly categoriesService: CategoriesService,
    private readonly toursService: ToursService,
  ) {}

  @Get()
  @Render("public/countries/index")
  async getAllCountries() {
    const countries = await this.countriesService.findAll()

    return {
      title: "Safari Destinations - Roads of Adventure Safaris",
      countries,
      layout: "layouts/public",
    }
  }

   @Get(":slug")
  @Render("public/countries/show") // This will render your country.ejs
  async getCountry(@Param("slug") slug: string, @Req() req: any, @Res({ passthrough: true }) res: Response) { // Add @Req and @Res
    try {
      const country = await this.countriesService.findBySlug(slug);

      // Fetch all categories linked to this country
      const categories = await this.categoriesService.findByCountry(country._id.toString()); // Pass country ID

      // Fetch all tours linked to this country
      const tours = await this.toursService.findByCountry(country._id.toString()); // Assuming findByCountry in ToursService takes country ID

      return {
        title: `${country.name}`,
        country,    // Pass the country object to the EJS template
        categories, // Pass the categories to the EJS template
        tours,      // Pass the tours to the EJS template
        layout: "layouts/public",
        messages: req.flash(), // To display any potential flash messages
        seo: {
          title: country.seoTitle || `${country.name}`,
          description: country.seoDescription || country.overview,
          keywords: country.seoKeywords,
          canonicalUrl: country.seoCanonicalUrl,
          ogImage: country.seoOgImage || country.coverImage,
        },
      }
    } catch (error) {
      console.error(`Error loading country page for slug ${slug}:`, error);
      req.flash('error_msg', error.message || 'Country not found or an error occurred.');
      return res.redirect('/'); // Redirect to homepage or a 404 page
    }
  }

  @Get("dashboard/countries")
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Render("dashboard/countries/index")
  async getCountries(@Query() query: { search?: string; page?: string; limit?: string }, @Req() req) {
    // Set default pagination values
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '6'); // Using 6 for a 2x3 grid visual
    const search = query.search || '';
  
    // Pass pagination and search parameters to the service
    const { data: countries, total, totalPages } = await this.countriesService.findAll({ search, page: page.toString(), limit: limit.toString() });
  
    return {
      title: "Countries - Dashboard",
      countries, // The paginated list of countries
      user: req.user,
      query, // Pass the original query object back to the view for filters
      currentPage: page,
      totalPages: totalPages,
      totalCountries: total,
      limit, // Pass the limit for potential client-side adjustments or display
      layout: "layouts/dashboard",
      messages: req.flash(), // Pass flash messages
    };
  }

  @Get("dashboard/countries/add") 
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Render("dashboard/countries/add")
  getAddCountryPage(@Req() req) {
    return {
      title: "Add Country - Dashboard",
      user: req.user,
      layout: "layouts/dashboard",
    }
  }

  @Post("dashboard/countries/add")
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    // FIX: Use FileFieldsInterceptor to handle multiple specific fields
    FileFieldsInterceptor([
      { name: 'coverImage', maxCount: 1 },
      { name: 'galleryImages', maxCount: 10 }, // Assuming 'galleryImages' is the name for multiple images
    ], getMulterConfig('countries')) // Pass the Multer config here
  )
  async addCountry(
    @Body() createCountryDto: CreateCountryDto,
    // FIX: Adjust type for @UploadedFiles to match FileFieldsInterceptor's output
    @UploadedFiles() uploadedFiles: { coverImage?: Express.Multer.File[], galleryImages?: Express.Multer.File[] },
    @Req() req,
    @Res() res: Response,
  ) {
    try {
      // FIX: Access files from the typed uploadedFiles object
      const newCoverImageFile = uploadedFiles.coverImage ? uploadedFiles.coverImage[0] : null;
      const newGalleryImageFiles = uploadedFiles.galleryImages || [];

      if (newCoverImageFile) {
        // FIX: Correct path to include /countries/ subfolder
        createCountryDto.coverImage = `/uploads/countries/${newCoverImageFile.filename}`;
      } else if (createCountryDto.coverImage === '') { // Handle case where cover image might be explicitly cleared
          createCountryDto.coverImage = null;
      }

      if (newGalleryImageFiles.length > 0) {
        // FIX: Correct paths to include /countries/ subfolder
        createCountryDto.galleryImages = newGalleryImageFiles.map((file) => `/uploads/countries/${file.filename}`);
      } else if (!createCountryDto.galleryImages) {
        // Ensure it's an empty array if no new files and no existing array from form
        createCountryDto.galleryImages = [];
      }


      await this.countriesService.create(createCountryDto, req.user.id);

      req.flash("success_msg", "Country added successfully");
      return res.redirect("/countries/dashboard/countries");
    } catch (error) {
      console.error('Error adding country:', error); // Add a more detailed log

      let flashMessage = "Failed to add country.";
      // Include your comprehensive error handling from other controllers
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
        if (error.code === 11000 && error.keyPattern && error.keyValue) {
          if (error.keyPattern.slug) flashMessage = "A country with this slug already exists. Please choose a different title or slug.";
          else if (error.keyPattern.title) flashMessage = "A country with this title already exists.";
          else flashMessage = "A duplicate entry error occurred.";
        } else {
          flashMessage = error.message;
        }
      }

      req.flash("error_msg", flashMessage);
      req.flash('oldInput', createCountryDto); // Preserve old input
      return res.redirect("/countries/dashboard/countries/add");
    }
  }

  @Get("dashboard/countries/edit/:id")
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Render("dashboard/countries/edit")
  async getEditCountryPage(@Param("id") id: string, @Req() req) {
    try {
      const country = await this.countriesService.findOne(id);
      if (!country) {
        req.flash("error_msg", "Country not found.");
        // Redirect back if country not found, or render an error page
        return req.res.redirect("/countries/dashboard/countries");
      }
      return {
        title: `Edit ${country.name} - Dashboard`,
        country, // Pass the fetched country object to the template
        user: req.user,
        layout: "layouts/dashboard",
        messages: req.flash(),
      };
    } catch (error) {
      console.error("Error fetching country for edit:", error);
      req.flash("error_msg", "Could not load country for editing.");
      return req.res.redirect("/countries/dashboard/countries");
    }
  }

  @Post("dashboard/countries/edit/:id") // Use PATCH for updates
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    // FIX: Use FileFieldsInterceptor to handle specific multiple fields
    FileFieldsInterceptor([
      { name: 'coverImage', maxCount: 1 }, // Assuming 'coverImage' is the name for the single cover image input
      { name: 'galleryImages', maxCount: 10 }, // Assuming 'galleryImages' is the name for the multiple gallery image input
    ], getMulterConfig('countries')) // Pass the Multer config here
  )
  async updateCountry(
    @Param("id") id: string,
    @Body() updateCountryDto: UpdateCountryDto,
    // FIX: Adjust type for @UploadedFiles to match FileFieldsInterceptor's output
    @UploadedFiles() uploadedFiles: { coverImage?: Express.Multer.File[], galleryImages?: Express.Multer.File[] },
    @Req() req,
    @Res() res: Response,
  ) {
    try {
      const country = await this.countriesService.findOne(id);
      if (!country) {
        req.flash("error_msg", "Country not found.");
        return res.redirect("/countries/dashboard/countries");
      }

      // Authorization check (already there, good)
      // if (req.user.role === UserRole.AGENT && tour.createdBy.toString() !== req.user.id) { // This might be for tours controller. Adapt for country.
      //   req.flash("error_msg", "You are not authorized to edit this country.");
      //   return res.redirect("/countries/dashboard/countries");
      // }


      // --- Handle Cover Image ---
      const newCoverImageFile = uploadedFiles.coverImage ? uploadedFiles.coverImage[0] : null;

      if (newCoverImageFile) {
        // FIX: Correct path to include /countries/ subfolder
        updateCountryDto.coverImage = `/uploads/countries/${newCoverImageFile.filename}`;
      } else if (updateCountryDto.coverImage === "remove") { // Assuming you send "remove" from client to clear
        updateCountryDto.coverImage = null; // Clear cover image
        // OPTIONAL: Add logic to delete the old file from disk here if desired
        // if (country.coverImage) { fs.unlinkSync(path.join(__dirname, '..', '..', country.coverImage)); }
      }
      // If newCoverImageFile is null and updateCountryDto.coverImage is not "remove",
      // it means the user didn't upload a new one and didn't explicitly remove it, so keep the old one (by not overwriting).
      // If updateCountryDto.coverImage is not provided at all, it will default to existing.
      // Make sure your EJS sends something like 'keep' or original URL if no change.


      // --- Handle Gallery Images ---
      const newGalleryImageFiles = uploadedFiles.galleryImages || [];
      let currentGalleryImages = country.galleryImages || [];

      // 1. Filter out removed gallery images (from hidden input `removedGalleryImages`)
      const removedGalleryImagePaths = updateCountryDto.removedGalleryImages
        ? updateCountryDto.removedGalleryImages.split(',').map(img => img.trim()).filter(Boolean)
        : [];
      currentGalleryImages = currentGalleryImages.filter(img => !removedGalleryImagePaths.includes(img));

      // 2. Add newly uploaded gallery images
      if (newGalleryImageFiles.length > 0) {
        // FIX: Correct paths to include /countries/ subfolder
        const newlyAddedGalleryPaths = newGalleryImageFiles.map((file) => `/uploads/countries/${file.filename}`);
        currentGalleryImages = [...currentGalleryImages, ...newlyAddedGalleryPaths];
      }
      updateCountryDto.galleryImages = currentGalleryImages;


      // --- Handle Slug Generation ---
      if (updateCountryDto.name && updateCountryDto.name !== country.name && !updateCountryDto.slug) {
          updateCountryDto.slug = this.countriesService.generateSlug(updateCountryDto.name);
      } else if (updateCountryDto.slug && updateCountryDto.slug !== country.slug) {
          // If slug was manually provided/changed, you might want to log it or validate
          // For now, it's just used as is.
      }


      // --- Update Country in Service ---
      await this.countriesService.update(id, updateCountryDto, req.user._id);

      req.flash("success_msg", "Country updated successfully!");
      return res.redirect("/countries/dashboard/countries");

    } catch (error) {
      console.error('Error updating country:', error); // Add a more detailed log

      let flashMessage = "Failed to update country. Please try again.";
      // Re-use comprehensive error handling from other controllers
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
        if (error.code === 11000 && error.keyPattern && error.keyValue) {
          if (error.keyPattern.slug) flashMessage = "A country with this slug already exists. Please choose a different title or slug.";
          else if (error.keyPattern.name) flashMessage = "A country with this name already exists.";
          else flashMessage = "A duplicate entry error occurred.";
        } else {
          flashMessage = error.message;
        }
      }

      req.flash("error_msg", flashMessage);
      req.flash('oldInput', updateCountryDto); // Useful for re-populating form
      return res.redirect(`/countries/dashboard/countries/edit/${id}`); // Redirect back to edit form
      // If you're rendering, uncomment and adjust:
      // const countryOnFailure = await this.countriesService.findOne(id).catch(e => null);
      // return res.render(`dashboard/countries/edit`, {
      //   title: "Edit Country - Dashboard",
      //   country: countryOnFailure || {},
      //   user: req.user,
      //   layout: "layouts/dashboard",
      //   messages: req.flash(),
      //   submittedBody: updateCountryDto // Pass submitted data to re-populate form
      // });
    }
  }


  @Get("dashboard/countries/delete/:id")
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteCountry(@Param("id") id: string, @Req() req, @Res() res: Response) {
    try {
      await this.countriesService.remove(id)

      req.flash("success_msg", "Country deleted successfully")
      return res.redirect("/countries/dashboard/countries")
    } catch (error) {
      req.flash("error_msg", error.message)
      return res.redirect("/countries/dashboard/countries")
    }
  }
}
