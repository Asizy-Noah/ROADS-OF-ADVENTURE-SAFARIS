import { Controller, Get, Post, Body, Param, UseGuards, Req, Res, Render, Query } from "@nestjs/common"
import { Response } from "express"
import { BookingsService } from "./bookings.service"
import type { CreateBookingDto } from "./dto/create-booking.dto"
import type { UpdateBookingDto } from "./dto/update-booking.dto"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { UserRole } from "../users/schemas/user.schema"
import { BookingStatus } from "./schemas/booking.schema"
import { ToursService } from "../tours/tours.service"
import { UsersService } from "../users/users.service"
import { SessionAuthGuard } from "../auth/guards/session-auth.guard";

@Controller("bookings")
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly toursService: ToursService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async createBooking(@Body() createBookingDto: CreateBookingDto, @Res() res: Response) {
    try {
      await this.bookingsService.create(createBookingDto)

      return res.redirect("/booking-success")
    } catch (error) {
      return res.redirect("/booking-error")
    }
  }

  @Get("dashboard")
  @UseGuards(SessionAuthGuard)
  @Render("dashboard/bookings/index")
  async getBookings(@Query() query, @Req() req) {
    const filter = { ...query }

    // If agent, only show bookings assigned to them
    if (req.user.role === UserRole.AGENT) {
      filter.assignedTo = req.user.id
    }

    const bookings = await this.bookingsService.findAll(filter)
    const tours = await this.toursService.findAll()

    return {
      title: "Bookings - Dashboard",
      bookings,
      tours,
      user: req.user,
      query,
      layout: "layouts/dashboard",
    }
  }

  @Get("dashboard/view/:id")
  @UseGuards(SessionAuthGuard)
  @Render("dashboard/bookings/view")
  async getBooking(@Param("id") id: string, @Req() req, @Res() res: Response) {
    const booking = await this.bookingsService.findOne(id)

    // If agent, check if booking is assigned to them
    if (req.user.role === UserRole.AGENT && booking.assignedTo?.toString() !== req.user.id) {
      req.flash("error_msg", "You are not authorized to view this booking")
      return res.redirect("/bookings/dashboard")
    }

    // Get agents for assignment (admin only)
    let agents = []
    if (req.user.role === UserRole.ADMIN) {
      agents = await this.usersService.findAllAgents()
    }

    return {
      title: "View Booking - Dashboard",
      booking,
      agents,
      user: req.user,
      layout: "layouts/dashboard",
    }
  }

  @Post("dashboard/update/:id")
  @UseGuards(SessionAuthGuard)
  async updateBooking(
    @Param("id") id: string,
    @Body() updateBookingDto: UpdateBookingDto,
    @Req() req,
    @Res() res: Response,
  ) {
    try {
      const booking = await this.bookingsService.findOne(id)

      // If agent, check if booking is assigned to them
      if (req.user.role === UserRole.AGENT && booking.assignedTo?.toString() !== req.user.id) {
        req.flash("error_msg", "You are not authorized to update this booking")
        return res.redirect("/bookings/dashboard")
      }

      await this.bookingsService.update(id, updateBookingDto, req.user.id)

      req.flash("success_msg", "Booking updated successfully")
      return res.redirect("/bookings/dashboard")
    } catch (error) {
      req.flash("error_msg", error.message)
      return res.redirect(`/bookings/dashboard/view/${id}`)
    }
  }

  @Get("dashboard/status/:id/:status")
  @UseGuards(SessionAuthGuard)
  async updateBookingStatus(
    @Param("id") id: string,
    @Param("status") status: BookingStatus,
    @Req() req,
    @Res() res: Response,
  ) {
    try {
      const booking = await this.bookingsService.findOne(id)

      // If agent, check if booking is assigned to them
      if (req.user.role === UserRole.AGENT && booking.assignedTo?.toString() !== req.user.id) {
        req.flash("error_msg", "You are not authorized to update this booking")
        return res.redirect("/bookings/dashboard")
      }

      await this.bookingsService.updateStatus(id, status, req.user.id)

      req.flash("success_msg", `Booking status updated to ${status}`)
      return res.redirect("/bookings/dashboard")
    } catch (error) {
      req.flash("error_msg", error.message)
      return res.redirect("/bookings/dashboard")
    }
  }

  @Get("dashboard/assign/:id/:agentId")
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async assignBookingToAgent(
    @Param("id") id: string,
    @Param("agentId") agentId: string,
    @Req() req,
    @Res() res: Response,
  ) {
    try {
      await this.bookingsService.assignToAgent(id, agentId, req.user.id)

      req.flash("success_msg", "Booking assigned to agent successfully")
      return res.redirect("/bookings/dashboard")
    } catch (error) {
      req.flash("error_msg", error.message)
      return res.redirect("/bookings/dashboard")
    }
  }

  @Get("dashboard/delete/:id")
  @UseGuards(SessionAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async deleteBooking(@Param("id") id: string, @Req() req, @Res() res: Response) {
    try {
      await this.bookingsService.remove(id)

      req.flash("success_msg", "Booking deleted successfully")
      return res.redirect("/bookings/dashboard")
    } catch (error) {
      req.flash("error_msg", error.message)
      return res.redirect("/bookings/dashboard")
    }
  }
}
