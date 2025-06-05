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
  UploadedFiles, // Remains UploadedFiles for FileFieldsInterceptor //
  HttpException,
  HttpStatus,
  Patch,
  Delete,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { FileFieldsInterceptor } from "@nestjs/platform-express"; // Keep FileFieldsInterceptor
import { AnyFilesInterceptor } from "@nestjs/platform-express"; 
import { Response } from "express";
import { PagesService } from "./pages.service";
import type { CreatePageDto } from "./dto/create-page.dto";
import type { UpdatePageDto } from "./dto/update-page.dto";
import { SessionAuthGuard } from "../auth/guards/session-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { UserRole } from "../users/schemas/user.schema";
import { PageStatus, PageType } from "./schemas/page.schema";
import { getMulterConfig } from '../../config/multer.config';

@Controller("pages")
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  // --- Dashboard Pages List ---
  @Get("dashboard")
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Render("dashboard/pages/index")
  async getPages(@Query() query: any, @Req() req) {
    try {
      const { pages, totalPages, currentPage } = await this.pagesService.findAll(query);
      const messages = req.flash();

      return {
        title: "Pages - Dashboard",
        pages,
        user: req.user,
        query: {
          search: query.search || "",
          status: query.status || "",
          page: currentPage,
          limit: query.limit || 10,
        },
        totalPages,
        currentPage,
        layout: "layouts/dashboard",
        messages: {
          success_msg: messages.success_msg,
          error_msg: messages.error_msg,
          error: messages.error,
        },
        pageStatuses: Object.values(PageStatus), // Pass statuses to template for filters
      };
    } catch (error) {
      console.error("Error fetching dashboard pages:", error);
      req.flash("error_msg", "Failed to load pages: " + error.message);
      return {
        title: "Pages - Dashboard",
        pages: [], // Return empty array on error
        user: req.user,
        query: { search: "", status: "", page: 1, limit: 10 },
        totalPages: 0,
        currentPage: 1,
        layout: "layouts/dashboard",
        messages: req.flash(),
        pageStatuses: Object.values(PageStatus),
      };
    }
  }

  // --- Add Page Form ---
  @Get("dashboard/add")
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Render("dashboard/pages/add")
  getAddPagePage(@Req() req) {
    const messages = req.flash();
    return {
      title: "Add Page - Dashboard",
      user: req.user,
      layout: "layouts/dashboard",
      messages: {
        success_msg: messages.success_msg,
        error_msg: messages.error_msg,
        error: messages.error,
      },
      oldInput: messages.oldInput ? messages.oldInput[0] : {},
      pageTypes: Object.values(PageType), // Pass page types to template
      pageStatuses: Object.values(PageStatus), // Pass page statuses to template
    };
  }


  @Post("dashboard/add")
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    AnyFilesInterceptor(getMulterConfig('pages')), // This will still catch all files, but we only process relevant ones
  )
  async addPage(
    @Body() createPageDto: CreatePageDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req,
    @Res() res: Response,
  ) {
    try {
      const categorizedFiles: Record<string, Express.Multer.File[]> = {};
      files.forEach(file => {
          if (!categorizedFiles[file.fieldname]) {
              categorizedFiles[file.fieldname] = [];
          }
          categorizedFiles[file.fieldname].push(file);
      });

      // Process cover image
      if (categorizedFiles.coverImage && categorizedFiles.coverImage.length > 0) {
        createPageDto.coverImage = `/uploads/pages/${categorizedFiles.coverImage[0].filename}`;
      } else if (createPageDto.coverImage === '') {
          createPageDto.coverImage = null;
      }

      // Process gallery images
      if (categorizedFiles.galleryImages && categorizedFiles.galleryImages.length > 0) {
        createPageDto.galleryImages = categorizedFiles.galleryImages.map(
          (file) => `/uploads/pages/${file.filename}`,
        );
      } else if (createPageDto.galleryImages && createPageDto.galleryImages.length === 0) {
          createPageDto.galleryImages = [];
      }

      // REMOVED: Logic for processing images within content blocks

      if (!createPageDto.slug && createPageDto.title) {
          createPageDto.slug = createPageDto.title
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, '')
              .trim()
              .replace(/\s+/g, '-');
      }

      await this.pagesService.create(createPageDto, req.user.id);

      req.flash("success_msg", "Page added successfully");
      return res.redirect("/pages/dashboard");
    } catch (error) {
      console.error("Error adding page:", error);
      let flashMessage = "Failed to add page.";
      // ... (rest of error handling remains the same) ...
      if (error instanceof HttpException) {
        const response = error.getResponse();
        if (typeof response === "object" && response !== null && "message" in response) {
          if (Array.isArray(response.message)) {
            flashMessage = response.message.join(", ");
          } else {
            flashMessage = response.message as string;
          }
        } else if (typeof response === "string") {
          flashMessage = response;
        } else {
          flashMessage = error.message || "An unknown error occurred.";
        }
      } else if (error.message) {
        if (error.code === 11000 && error.keyPattern && error.keyValue) {
          if (error.keyPattern.slug) flashMessage = "A page with this slug already exists. Please choose a different title or slug.";
          else if (error.keyPattern.title) flashMessage = "A page with this title already exists.";
          else flashMessage = "A duplicate entry error occurred.";
        } else {
          flashMessage = error.message;
        }
      }

      req.flash("error_msg", flashMessage);
      req.flash("oldInput", createPageDto);
      return res.redirect("/pages/dashboard/add");
    }
  }

  // --- Edit Page Form ---
  @Get("dashboard/edit/:id")
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Render("dashboard/pages/edit")
  async getEditPagePage(@Param("id") id: string, @Req() req, @Res({ passthrough: true }) res: Response) {
    try {
      const page = await this.pagesService.findOne(id);
      if (!page) {
        throw new NotFoundException(`Page with ID ${id} not found.`);
      }
      const messages = req.flash();

      return {
        title: "Edit Page - Dashboard",
        page,
        user: req.user,
        layout: "layouts/dashboard",
        messages: {
          success_msg: messages.success_msg,
          error_msg: messages.error_msg,
          error: messages.error,
        },
        oldInput: messages.oldInput ? messages.oldInput[0] : {},
        pageTypes: Object.values(PageType), // Pass page types to template
        pageStatuses: Object.values(PageStatus), // Pass page statuses to template
      };
    } catch (error) {
      console.error("Error fetching page for edit:", error);
      req.flash("error_msg", error.message || "Failed to load page for editing.");
      return res.redirect("/pages/dashboard");
    }
  }

  // --- Handle Update Page Submission (using PATCH for clarity) ---
  @Patch("dashboard/edit/:id")
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    AnyFilesInterceptor(getMulterConfig('pages')),
  )
  async updatePage(
    @Param("id") id: string,
    @Body() updatePageDto: UpdatePageDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Req() req,
    @Res() res: Response,
  ) {
    try {
      const existingPage = await this.pagesService.findOne(id);
      if (!existingPage) {
        throw new NotFoundException(`Page with ID ${id} not found.`);
      }

      const categorizedFiles: Record<string, Express.Multer.File[]> = {};
      files.forEach(file => {
          if (!categorizedFiles[file.fieldname]) {
              categorizedFiles[file.fieldname] = [];
          }
          categorizedFiles[file.fieldname].push(file);
      });

      // Process cover image
      if (categorizedFiles.coverImage && categorizedFiles.coverImage.length > 0) {
        updatePageDto.coverImage = `/uploads/pages/${categorizedFiles.coverImage[0].filename}`;
      } else if (updatePageDto.coverImage === '') {
          updatePageDto.coverImage = null;
      } else {
          updatePageDto.coverImage = existingPage.coverImage;
      }

      // Process gallery images
      if (categorizedFiles.galleryImages && categorizedFiles.galleryImages.length > 0) {
        updatePageDto.galleryImages = categorizedFiles.galleryImages.map(
          (file) => `/uploads/pages/${file.filename}`,
        );
      } else if (updatePageDto.galleryImages && updatePageDto.galleryImages.length === 0) {
          updatePageDto.galleryImages = [];
      } else {
          updatePageDto.galleryImages = existingPage.galleryImages;
      }

      // REMOVED: Logic for processing images within content blocks

      if (!updatePageDto.slug && updatePageDto.title) {
          updatePageDto.slug = updatePageDto.title
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, '')
              .trim()
              .replace(/\s+/g, '-');
      }

      await this.pagesService.update(id, updatePageDto, req.user.id);

      req.flash("success_msg", "Page updated successfully");
      return res.redirect("/pages/dashboard");
    } catch (error) {
      console.error("Error updating page:", error);
      let flashMessage = "Failed to update page.";
      // ... (rest of error handling remains the same) ...
      if (error instanceof HttpException) {
        const response = error.getResponse();
        if (typeof response === "object" && response !== null && "message" in response) {
          if (Array.isArray(response.message)) {
            flashMessage = response.message.join(", ");
          } else {
            flashMessage = response.message as string;
          }
        } else if (typeof response === "string") {
          flashMessage = response;
        } else {
          flashMessage = error.message || "An unknown error occurred.";
        }
      } else if (error.message) {
        if (error.code === 11000 && error.keyPattern && error.keyValue) {
          if (error.keyPattern.slug) flashMessage = "A page with this slug already exists. Please choose a different title or slug.";
          else flashMessage = "A duplicate entry error occurred.";
        } else {
          flashMessage = error.message;
        }
      }

      req.flash("error_msg", flashMessage);
      req.flash("oldInput", updatePageDto);
      return res.redirect(`/pages/dashboard/edit/${id}`);
    }
  }

  // --- Handle Delete Page Submission (using DELETE for better RESTfulness) ---
  @Delete("dashboard/:id") // Changed to DELETE route
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deletePage(@Param("id") id: string, @Req() req, @Res() res: Response) {
    try {
      await this.pagesService.remove(id);

      req.flash("success_msg", "Page deleted successfully");
      // Use status 200 OK or 204 No Content for successful deletion
      // You might redirect or send a success response depending on frontend.
      // For simple page reload, redirect is fine.
      return res.redirect("/pages/dashboard");
    } catch (error) {
      console.error("Error deleting page:", error);
      req.flash("error_msg", error.message || "Failed to delete page.");
      return res.redirect("/pages/dashboard");
    }
  }

  // --- Update Page Status ---
  @Patch("dashboard/status/:id/:status") // Changed to PATCH
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updatePageStatus(
    @Param("id") id: string,
    @Param("status") status: PageStatus,
    @Req() req,
    @Res() res: Response,
  ) {
    try {
      if (!Object.values(PageStatus).includes(status)) {
        throw new BadRequestException(`Invalid page status: ${status}`);
      }

      await this.pagesService.updateStatus(id, status, req.user.id);

      req.flash("success_msg", `Page status updated to ${status}`);
      return res.redirect("/pages/dashboard");
    } catch (error) {
      console.error("Error updating page status:", error);
      req.flash("error_msg", error.message || "Failed to update page status.");
      return res.redirect("/pages/dashboard");
    }
  }

  // --- Public View Page (Optional, for completeness) ---
  @Get(":slug") // GET /pages/:slug (public single page view)
  @Render("public/pages/show") // Assuming you'll have a public show template for pages
  async getPublicSinglePage(@Param("slug") slug: string, @Req() req, @Res({ passthrough: true }) res: Response) {
      try {
          const page = await this.pagesService.findBySlug(slug);
          if (!page) {
              throw new NotFoundException(`Page with slug '${slug}' not found or not published.`);
          }
          return {
              title: page.seoTitle || page.title,
              page,
              layout: "layouts/public",
              seo: {
                  title: page.seoTitle || page.title,
                  description: page.seoDescription || page.description,
                  keywords: page.seoKeywords,
                  canonicalUrl: page.seoCanonicalUrl,
                  ogImage: page.seoOgImage || page.coverImage,
              },
          };
      } catch (error) {
          if (error instanceof NotFoundException) {
              req.flash('error_msg', error.message);
              return res.redirect('/pages'); // Redirect to a public pages index, or 404 page
          }
          console.error('Error loading public page:', error);
          req.flash('error_msg', 'An unexpected error occurred while loading the page.');
          return res.redirect('/pages'); // Or render an error page
      }
  }
}