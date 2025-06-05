import { Controller, Get, Render, Param, Query, Res } from "@nestjs/common"
import { Response } from "express"
import { AppService } from "./app.service"
import { ToursService } from "./modules/tours/tours.service"
import { CountriesService } from "./modules/countries/countries.service"
import { CategoriesService } from "./modules/categories/categories.service"
import { BlogsService } from "./modules/blogs/blogs.service"
import { ReviewsService } from "./modules/reviews/reviews.service"
import { PagesService } from "./modules/pages/pages.service"
import { SubscribersService } from "./modules/subscribers/subscribers.service"
import { BlogFindAllOptions } from "./modules/blogs/interfaces/blog-find-all-options.interface";
import { BlogStatus } from "./modules/blogs/schemas/blog.schema";
import { PageType } from "./modules/pages/schemas/page.schema";
import { TourStatus } from "./modules/tours/schemas/tour.schema";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly toursService: ToursService,
    private readonly countriesService: CountriesService,
    private readonly categoriesService: CategoriesService,
    private readonly blogsService: BlogsService,
    private readonly reviewsService: ReviewsService,
    private readonly pagesService: PagesService,
    private readonly subscribersService: SubscribersService,
  ) {}

  @Get()
  @Render("public/index")
  async getHomePage(@Query('page') pageQuery: string = '1') { // Changed 'page' to 'pageQuery' to avoid conflict with `page` inside findAll return
    const page = parseInt(pageQuery, 10);
    const limit = 4; // Display 4 blogs on the homepage

    // Fetch About Us page
    const aboutUsPage = await this.pagesService.findOneByType(PageType.ABOUT); 
    
    

    // Fetch featured tours (packages) - assuming findFeatured still returns a simple array
    const { tours: featuredTours } = await this.toursService.findAll({ status: TourStatus.PUBLISHED }); // Assuming this method exists and returns all tours
  
    // Fetch all countries for destinations
    const result = await this.countriesService.findAll();
const countries = Array.isArray(result) ? result : result.data ?? [];

    
    // Fetch approved reviews (if used on the homepage)
    const reviews = await this.reviewsService.findApproved();

    // --- FIX: Pass queryOptions object to blogsService.findAll ---
    const { blogs, totalBlogs, currentPage, totalPages } = await this.blogsService.findAll({
      page: page,
      limit: limit,
      sortBy: 'newest', // Ensure you get the latest blogs
      status: BlogStatus.VISIBLE, // <--- CHANGED FROM 'published' to BlogStatus.VISIBLE
    });

    return {
      title: "Roads of Adventure Safaris - African Safari Tours",
      aboutUsPage,
      featuredTours,
      countries,
      blogs,
      reviews,
      currentPage, // Pass these directly from the service response
      totalPages,
      layout: "layouts/public",
    };
  }

  @Get('page/:slug')
  @Render('public/page')
  async getPage(@Param('slug') slug: string) {
    const page = await this.pagesService.findBySlug(slug);

    return {
      title: `${page.title} - Roads of Adventure Safaris`,
      page,
      layout: 'layouts/public',
      seo: {
        title: page.seoTitle || `${page.title} - Roads of Adventure Safaris`,
        description: page.seoDescription || page.description,
        keywords: page.seoKeywords,
        canonicalUrl: page.seoCanonicalUrl,
        ogImage: page.seoOgImage || page.coverImage,
      },
    };
  }

  @Get("subscribe")
  async subscribe(@Query() query, @Res() res: Response) {
    try {
      await this.subscribersService.create({
        name: query.name,
        email: query.email,
        phoneNumber: query.phone,
      })

      return res.redirect(query.redirect || "/?subscribed=true")
    } catch (error) {
      return res.redirect(query.redirect || "/?subscribed=false")
    }
  }

  @Get('unsubscribe')
  @Render('public/unsubscribe')
  async getUnsubscribePage(@Query('email') email: string) {
    return {
      title: 'Unsubscribe - Roads of Adventure Safaris',
      email,
      layout: 'layouts/public',
    };
  }

  @Get("unsubscribe/confirm")
  async unsubscribe(@Query('email') email: string, @Res() res: Response) {
    try {
      // Find subscriber by email and delete
      const subscribers = await this.subscribersService.findAll({ search: email })

      if (subscribers.length > 0) {
        await this.subscribersService.remove(subscribers[0]._id)
      }

      return res.redirect("/?unsubscribed=true")
    } catch (error) {
      return res.redirect("/?unsubscribed=false")
    }
  }
}
