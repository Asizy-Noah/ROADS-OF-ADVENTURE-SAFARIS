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
    UseInterceptors,
    UploadedFile,
    Query,
    HttpException,
    HttpStatus,
    Patch,
    Delete,
    NotFoundException,
    BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";
import { BlogsService } from "./blogs.service";
import type { CreateBlogDto } from "./dto/create-blog.dto";
import type { UpdateBlogDto } from "./dto/update-blog.dto";
import { SessionAuthGuard } from "../auth/guards/session-auth.guard";
import { UserRole } from "../users/schemas/user.schema";
import { BlogStatus } from "./schemas/blog.schema";
import { getMulterConfig } from '../../config/multer.config'; 
import { CountriesService } from "../countries/countries.service";
import { ToursService } from '../tours/tours.service';
import { CategoriesService } from "../categories/categories.service";
import { RolesGuard } from "../auth/guards/roles.guard"; // Adjust path based on your project structure
import { Roles } from "../auth/decorators/roles.decorator"; // Adjust path based on your project structure
// Define interfaces for clarity
interface PublicBlogsQuery {
    search?: string;
    page?: string;
    limit?: string;
    sortBy?: string;
    category?: string;
    tag?: string;
}

interface DashboardBlogsQuery {
    status?: string;
    search?: string;
    page?: string;
    limit?: string; // Add limit for dashboard pagination control if needed
    sortBy?: string;
    category?: string;
    country?: string;
    tag?: string;
}

@Controller("blogs") // Base path for all routes in this controller
export class BlogsController {
    constructor(
        private readonly blogsService: BlogsService,
        private readonly countriesService: CountriesService,
        private readonly categoriesService: CategoriesService,
        private readonly toursService: ToursService,
    ) {}

    // ===============================================
    // PUBLIC-FACING BLOG ROUTES (accessible to everyone)
    // ===============================================

    @Get() // GET /blogs (public blog listing)
    @Render("public/blogs/index")
    async getPublicAllBlogs(@Query() query: PublicBlogsQuery) {
        // Build the filter for public blogs (only visible blogs)
        const filterOptions: any = { status: BlogStatus.VISIBLE };

        if (query.search) {
            filterOptions.$or = [
                { title: { $regex: query.search, $options: 'i' } },
                { excerpt: { $regex: query.search, $options: 'i' } },
                { content: { $regex: query.search, $options: 'i' } }
            ];
        }
        // Removed category and tag filtering for this specific request,
        // but you had it before, consider if you want to keep it as an option.
        // if (query.category) { filterOptions.category = query.category; }
        // if (query.tag) { filterOptions.tag = query.tag; }

        const { blogs, totalBlogs, currentPage, totalPages } = await this.blogsService.findAll({
            ...filterOptions,
            page: query.page ? parseInt(query.page) : 1,
            limit: query.limit ? parseInt(query.limit) : 8, // Adjust limit if you want more/fewer cards per page
            sortBy: query.sortBy || 'newest',
        });

        // Fetch popular blogs for the sidebar
        const popularBlogs = await this.blogsService.findPopular(5); // Fetch top 5 popular blogs

        // Countries and Categories are no longer needed here if you remove the sections from the sidebar.
        // If you remove them, you can also remove the lines fetching them and passing them to the template.
        // For now, I'll remove passing them, assume the service calls themselves are fine for other uses.
        // const countriesResult = await this.countriesService.findAll({});
        // const categoriesResult = await this.categoriesService.findAll({});

        // The allTags and uniqueTags calculation is also not needed if the Tags section is removed.
        // const allTags = blogs.reduce((tags: string[], blog) => { /* ... */ }, []);
        // const uniqueTags = [...new Set(allTags)];

        return {
            title: "Safari Updates & Blog - Roads of Adventure Safaris",
            blogs,
            // countries: countriesResult.data || [], // Removed based on request
            // categories: categoriesResult.data || [], // Removed based on request
            // tags: uniqueTags, // Removed based on request
            query, // Still pass query for the search bar to keep sticky value
            currentPage,
            totalPages,
            popularBlogs, // Pass popular blogs
            layout: "layouts/public",
        };
    }


    // IMPORTANT: Specific routes like 'dashboard' or 'add' MUST come before dynamic ':slug'
    // Otherwise, 'dashboard' might be interpreted as a slug!

    // ===============================================
    // DASHBOARD BLOG ROUTES (authenticated users only)
    // ===============================================

    @Get("dashboard/blogs") // GET /blogs/dashboard/blogs (dashboard blog listing)
    @UseGuards(SessionAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.AGENT)
    @Render("dashboard/blogs/index") // <--- THIS MUST RENDER THE DASHBOARD EJS
    async getDashboardBlogs(@Query() query: DashboardBlogsQuery, @Req() req) {
        const filters: any = {};
        const page = parseInt(query.page as string, 10) || 1;
        const limit = parseInt(query.limit as string, 10) || 10; // Default limit for dashboard

        // Apply Status Filter
        if (query.status && query.status !== 'all' && Object.values(BlogStatus).includes(query.status as BlogStatus)) {
            filters.status = query.status;
        }

        // Apply Search Filter across multiple fields
        if (query.search) {
            filters.$or = [
                { title: { $regex: query.search, $options: 'i' } },
                { excerpt: { $regex: query.search, $options: 'i' } },
                { content: { $regex: query.search, $options: 'i' } }
            ];
        }

        // Apply Category Filter
        if (query.category) {
            filters.categories = query.category; // Service will handle ObjectId conversion
        }

        // Apply Country Filter (if you have one for blogs)
        if (query.country) {
            filters.countries = query.country; // Service will handle ObjectId conversion
        }

        // Apply Tag Filter
        if (query.tag) {
            filters.tags = query.tag; // Service will handle tag array filtering
        }

        // If agent, only show their blogs
        if (req.user.role === UserRole.AGENT) {
            filters.author = req.user.id; // Filter by the authenticated user's ID
        }

        try {
            const { blogs, totalBlogs, currentPage, totalPages } = await this.blogsService.findAll({
                ...filters,
                page,
                limit,
                sortBy: query.sortBy || 'newest', // Default sort for dashboard
            });

            const countriesResult = await this.countriesService.findAll({});
            const categoriesResult = await this.categoriesService.findAll({});

            const messages = req.flash();

            return {
                title: "Blogs - Dashboard",
                blogs,
                countries: countriesResult.data || [],
                categories: categoriesResult.data || [],
                user: req.user,
                // Pass back the current query state to the EJS for sticky form fields
                query: {
                    status: query.status || 'all',
                    search: query.search || '',
                    page: page,
                    limit: limit,
                    sortBy: query.sortBy || 'newest',
                    category: query.category || '',
                    country: query.country || '',
                    tag: query.tag || '',
                },
                currentPage,
                totalPages,
                layout: "layouts/dashboard",
                messages: {
                    success_msg: messages.success_msg,
                    error_msg: messages.error_msg,
                    error: messages.error,
                },
                blogStatuses: Object.values(BlogStatus),
            };
        } catch (error) {
            console.error("Error fetching dashboard blogs:", error);
            req.flash('error_msg', 'Failed to load dashboard blog posts: ' + error.message);
            return {
                blogs: [], // Return empty array on error
                query: { status: 'all', search: '', page: 1, limit: 10, sortBy: 'newest', category: '', country: '', tag: '' },
                currentPage: 1,
                totalPages: 0,
                messages: req.flash(),
                layout: "layouts/dashboard",
                blogStatuses: Object.values(BlogStatus),
                countries: [],
                categories: [],
                user: req.user,
            };
        }
    }


    @Get("dashboard/add") // GET /blogs/dashboard/add
    @UseGuards(SessionAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.AGENT)
    @Render("dashboard/blogs/add") // Renders dashboard add form
    async getAddBlogPage(@Req() req) {
        const countriesResult = await this.countriesService.findAll({});
        const categoriesResult = await this.categoriesService.findAll({});
        const messages = req.flash();

        return {
            title: "Add Blog - Dashboard",
            countries: countriesResult.data || [],
            categories: categoriesResult.data || [],
            user: req.user,
            layout: "layouts/dashboard",
            messages: {
                success_msg: messages.success_msg,
                error_msg: messages.error_msg,
                error: messages.error,
            },
            oldInput: messages.oldInput ? messages.oldInput[0] : {},
            blogStatuses: Object.values(BlogStatus),
        };
    }

   @Post("dashboard/add") // POST /blogs/dashboard/add
    @UseGuards(SessionAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.AGENT)
    @UseInterceptors(FileInterceptor("coverImage", getMulterConfig('blogs')))
    async addBlog(
        @Body() createBlogDto: CreateBlogDto,
        @UploadedFile() file: Express.Multer.File,
        @Req() req,
        @Res() res: Response
    ) {
        

        try {
            if (file) {
                createBlogDto.coverImage = `/uploads/blogs/${file.filename}`;
               
            } else if (createBlogDto.coverImage === '') {
                createBlogDto.coverImage = null; // Handle case where no file uploaded and no old image (if it's an edit)
            } else {
                // If no new file uploaded and createBlogDto.coverImage is not empty,
                // it means it's an existing image (e.g., during an edit).
                // For 'add' route, this might imply a missing file;
                // adjust as per your form's requirement if image is optional.
                // For 'add' route, if file is mandatory:
                req.flash("error_msg", "Please upload a cover image.");
                req.flash('oldInput', createBlogDto);
                return res.redirect("/blogs/dashboard/add");
            }

            // Ensure tags are an array
            if (typeof createBlogDto.tags === "string") {
                createBlogDto.tags = (createBlogDto.tags as string)
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(tag => tag.length > 0);
            } else if (createBlogDto.tags === null || createBlogDto.tags === undefined) {
                createBlogDto.tags = [];
            }

            // Set author and updatedBy for new blog
            // (Assuming req.user.id is populated by SessionAuthGuard)
            (createBlogDto as any).author = req.user.id;
            (createBlogDto as any).updatedBy = req.user.id;

           
            await this.blogsService.create(createBlogDto, req.user.id);
            
            req.flash("success_msg", "Blog added successfully");
            
            return res.redirect("/blogs/dashboard/blogs"); // Redirect to dashboard index
            // -------- MISSING CRITICAL PART ENDS HERE --------

        } catch (error) {
            console.error('Error adding blog:', error);
            let flashMessage = "Failed to add blog post.";

            // Your existing comprehensive error handling
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
                    if (error.keyPattern.slug) flashMessage = "A blog with this slug already exists. Please choose a different title or slug.";
                    else if (error.keyPattern.title) flashMessage = "A blog with this title already exists.";
                    else flashMessage = "A duplicate entry error occurred.";
                } else {
                    flashMessage = error.message;
                }
            }

            req.flash("error_msg", flashMessage);
            req.flash('oldInput', createBlogDto);
            return res.redirect("/blogs/dashboard/add"); // Redirect back to add form
        }
    }


    @Get("dashboard/edit/:id") // GET /blogs/dashboard/edit/:id
    @UseGuards(SessionAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.AGENT)
    @Render("dashboard/blogs/edit") // Renders dashboard edit form
    async getEditBlogPage(@Param("id") id: string, @Req() req, @Res({ passthrough: true }) res: Response) {
        try {
            const blog = await this.blogsService.findOne(id);
            if (!blog) {
                throw new NotFoundException(`Blog with ID ${id} not found.`);
            }

            // Authorization check
            if (req.user.role === UserRole.AGENT && blog.author.toString() !== req.user.id) {
                req.flash("error_msg", "You are not authorized to edit this blog");
                return res.redirect("/blogs/dashboard/blogs");
            }

            const countriesResult = await this.countriesService.findAll({});
            const categoriesResult = await this.categoriesService.findAll({});
            const messages = req.flash();

            return {
                title: "Edit Blog - Dashboard",
                blog,
                countries: countriesResult.data || [],
                categories: categoriesResult.data || [],
                user: req.user,
                layout: "layouts/dashboard",
                messages: {
                    success_msg: messages.success_msg,
                    error_msg: messages.error_msg,
                    error: messages.error,
                },
                oldInput: messages.oldInput ? messages.oldInput[0] : {},
                blogStatuses: Object.values(BlogStatus),
            };
        } catch (error) {
            console.error('Error fetching blog for edit:', error);
            req.flash("error_msg", error.message || "Failed to load blog for editing.");
            return res.redirect("/blogs/dashboard/blogs");
        }
    }

    @Patch("dashboard/blogs/edit/:id") // PATCH /blogs/dashboard/blogs/edit/:id
    @UseGuards(SessionAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.AGENT)
    @UseInterceptors(FileInterceptor("coverImage", getMulterConfig('blogs')))
    async updateBlog(
        @Param("id") id: string,
        @Body() updateBlogDto: UpdateBlogDto,
        @UploadedFile() file: Express.Multer.File,
        @Req() req,
        @Res() res: Response,
    ) {
        try {
            const existingBlog = await this.blogsService.findOne(id);
            if (!existingBlog) {
                 throw new NotFoundException(`Blog with ID ${id} not found.`);
            }

            // Authorization check
            if (req.user.role === UserRole.AGENT && existingBlog.author.toString() !== req.user.id) {
                req.flash("error_msg", "You are not authorized to update this blog");
                return res.redirect("/blogs/dashboard/blogs");
            }

            if (file) {
                updateBlogDto.coverImage = `/uploads/blogs/${file.filename}`;
            } else if (updateBlogDto.coverImage === '') {
                updateBlogDto.coverImage = null;
            }

            if (typeof updateBlogDto.tags === "string") {
                updateBlogDto.tags = (updateBlogDto.tags as string).split(",").map((tag) => tag.trim()).filter(tag => tag.length > 0);
            } else if (updateBlogDto.tags === null || updateBlogDto.tags === undefined) {
                updateBlogDto.tags = [];
            }

            if (!updateBlogDto.slug && updateBlogDto.title) {
                updateBlogDto.slug = updateBlogDto.title
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .trim()
                    .replace(/\s+/g, '-');
            }

            await this.blogsService.update(id, updateBlogDto, req.user.id);

            req.flash("success_msg", "Blog updated successfully");
            return res.redirect("/blogs/dashboard/blogs"); // Redirect to dashboard index
        } catch (error) {
            console.error('Error updating blog:', error);
            let flashMessage = "Failed to update blog.";
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
                    if (error.keyPattern.slug) flashMessage = "A blog with this slug already exists. Please choose a different title or slug.";
                    else if (error.keyPattern.title) flashMessage = "A blog with this title already exists.";
                    else flashMessage = "A duplicate entry error occurred.";
                } else {
                    flashMessage = error.message;
                }
            }

            req.flash("error_msg", flashMessage);
            req.flash('oldInput', updateBlogDto);
            return res.redirect(`/blogs/dashboard/edit/${id}`); // Redirect back to edit form
        }
    }

    @Delete("dashboard/blogs/:id") // DELETE /blogs/dashboard/blogs/:id
    @UseGuards(SessionAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.AGENT) 
    async deleteBlog(@Param("id") id: string, @Req() req, @Res() res: Response) {
        try {
            const blog = await this.blogsService.findOne(id);
            if (!blog) {
                 throw new NotFoundException(`Blog with ID ${id} not found.`);
            }

            // Authorization check
            if (req.user.role === UserRole.AGENT && blog.author.toString() !== req.user.id) {
                req.flash("error_msg", "You are not authorized to delete this blog");
                return res.redirect("/blogs/dashboard/blogs");
            }

            await this.blogsService.remove(id);

            req.flash("success_msg", "Blog deleted successfully");
            return res.redirect("/blogs/dashboard/blogs"); // Redirect to dashboard index
        } catch (error) {
            console.error('Error deleting blog:', error);
            req.flash("error_msg", error.message || "Failed to delete blog.");
            return res.redirect("/blogs/dashboard/blogs");
        }
    }

    @Patch("dashboard/status/:id/:status") // PATCH /blogs/dashboard/status/:id/:status
    @UseGuards(SessionAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.AGENT)
    async updateBlogStatus(
        @Param("id") id: string,
        @Param("status") status: BlogStatus,
        @Req() req,
        @Res() res: Response,
    ) {
        try {
            if (!Object.values(BlogStatus).includes(status as BlogStatus)) {
                throw new BadRequestException(`Invalid blog status: ${status}`);
            }

            const blog = await this.blogsService.findOne(id);
            if (!blog) {
                 throw new NotFoundException(`Blog with ID ${id} not found.`);
            }

            // Authorization check
            if (req.user.role === UserRole.AGENT && blog.author.toString() !== req.user.id) {
                req.flash("error_msg", "You are not authorized to update this blog");
                return res.redirect("/blogs/dashboard/blogs");
            }

            await this.blogsService.updateStatus(id, status, req.user.id);

            req.flash("success_msg", `Blog status updated to ${status}`);
            return res.redirect("/blogs/dashboard/blogs"); // Redirect to dashboard index
        } catch (error) {
            console.error('Error updating blog status:', error);
            req.flash("error_msg", error.message || "Failed to update blog status.");
            return res.redirect("/blogs/dashboard/blogs");
        }
    }

    // ===============================================
    // PUBLIC-FACING SINGLE BLOG POST ROUTE (Must be last to avoid capturing dashboard routes)
    // ===============================================
    @Get(":slug") // GET /blogs/:slug (public single blog post)
  @Render("public/blogs/show") // <--- THIS IS FOR THE PUBLIC VIEW
  async getPublicSingleBlog(@Param("slug") slug: string, @Req() req, @Res({ passthrough: true }) res: Response) {
    try {
      const blog = await this.blogsService.findBySlug(slug);
      if (!blog) {
        throw new NotFoundException(`Blog with slug '${slug}' not found or not visible.`);
      }

      // --- New: Fetch Popular Tour Packages ---
      const popularTours = await this.toursService.findPopular(10); // Fetch 4 popular tours
      
      // --- End New ---

      // Optional: Increment views for the blog post (if you have a views field for blogs)
      // await this.blogsService.incrementViews(slug); // You'd need to create this method in BlogsService

      // Get related blogs from the same categories or countries
      const relatedBlogsResult = await this.blogsService.findAll({
        status: BlogStatus.VISIBLE,
        limit: 4, // Fetch a few more to filter out current blog
      });

      const filteredRelatedBlogs = relatedBlogsResult.blogs.filter((relatedBlog) => relatedBlog._id.toString() !== blog._id.toString());

      return {
        title: `${blog.title} - Roads of Adventure Safaris`,
        blog,
        popularTours, // <-- Pass popular tours to the EJS template
        relatedBlogs: filteredRelatedBlogs.slice(0, 3),
        layout: "layouts/public",
        seo: {
          title: blog.seoTitle || `${blog.title} - Roads of Adventure Safaris`,
          description: blog.seoDescription || blog.excerpt,
          keywords: blog.seoKeywords,
          canonicalUrl: blog.seoCanonicalUrl,
          ogImage: blog.seoOgImage || blog.coverImage,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        req.flash('error_msg', error.message);
        return res.redirect('/blogs');
      }
      console.error('Error loading public blog post:', error);
      req.flash('error_msg', 'An unexpected error occurred while loading the blog post.');
      return res.redirect('/blogs');
    }
  }
}