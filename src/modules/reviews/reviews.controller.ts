import { Controller, Get, Post, Body, Param, UseGuards, Req, Res, Render, Query } from "@nestjs/common"
import { Response } from "express"
import { ReviewsService } from "./reviews.service"
import type { CreateReviewDto } from "./dto/create-review.dto"
import type { UpdateReviewDto } from "./dto/update-review.dto"
import { SessionAuthGuard } from "../auth/guards/session-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { UserRole } from "../users/schemas/user.schema"
import { ReviewStatus } from "./schemas/review.schema"
import { ToursService } from "../tours/tours.service"

@Controller("reviews")
export class ReviewsController {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly toursService: ToursService,
  ) {}

  @Post()
  async createReview(@Body() createReviewDto: CreateReviewDto, @Res() res: Response) {
    try {
      await this.reviewsService.create(createReviewDto)

      return res.redirect(createReviewDto.tour ? `/tours/${createReviewDto.tour}?review=success` : "/?review=success")
    } catch (error) {
      return res.redirect(createReviewDto.tour ? `/tours/${createReviewDto.tour}?review=error` : "/?review=error")
    }
  }

  @Get("dashboard")
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Render("dashboard/reviews/index")
  async getReviews(@Query() query, @Req() req) {
    const reviews = await this.reviewsService.findAll(query)
    const tours = await this.toursService.findAll()

    return {
      title: "Reviews - Dashboard",
      reviews,
      tours,
      user: req.user,
      query,
      layout: "layouts/dashboard",
    }
  }

  @Get("dashboard/view/:id")
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Render("dashboard/reviews/view")
  async getReview(@Param("id") id: string, @Req() req) {
    const review = await this.reviewsService.findOne(id)

    return {
      title: "View Review - Dashboard",
      review,
      user: req.user,
      layout: "layouts/dashboard",
    }
  }

  @Post("dashboard/respond/:id")
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async respondToReview(
    @Param("id") id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() req,
    @Res() res: Response,
  ) {
    try {
      await this.reviewsService.update(id, updateReviewDto)

      req.flash("success_msg", "Response added successfully")
      return res.redirect("/reviews/dashboard")
    } catch (error) {
      req.flash("error_msg", error.message)
      return res.redirect(`/reviews/dashboard/view/${id}`)
    }
  }

  @Get("dashboard/approve/:id")
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async approveReview(@Param("id") id: string, @Req() req, @Res() res: Response) {
    try {
      await this.reviewsService.updateStatus(id, ReviewStatus.APPROVED)

      req.flash("success_msg", "Review approved successfully")
      return res.redirect("/reviews/dashboard")
    } catch (error) {
      req.flash("error_msg", error.message)
      return res.redirect("/reviews/dashboard")
    }
  }

  @Get("dashboard/reject/:id")
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async rejectReview(@Param("id") id: string, @Req() req, @Res() res: Response) {
    try {
      await this.reviewsService.updateStatus(id, ReviewStatus.REJECTED)

      req.flash("success_msg", "Review rejected successfully")
      return res.redirect("/reviews/dashboard")
    } catch (error) {
      req.flash("error_msg", error.message)
      return res.redirect("/reviews/dashboard")
    }
  }

  @Get("dashboard/delete/:id")
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteReview(@Param("id") id: string, @Req() req, @Res() res: Response) {
    try {
      await this.reviewsService.remove(id)

      req.flash("success_msg", "Review deleted successfully")
      return res.redirect("/reviews/dashboard")
    } catch (error) {
      req.flash("error_msg", error.message)
      return res.redirect("/reviews/dashboard")
    }
  }
}
