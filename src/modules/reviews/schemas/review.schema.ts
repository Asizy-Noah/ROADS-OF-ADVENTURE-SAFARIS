import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"
import * as mongoose from "mongoose"
import type { Tour } from "../../tours/schemas/tour.schema"

export enum ReviewStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

@Schema({ timestamps: true })
export class Review extends Document {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  email: string

  @Prop()
  country: string

  @Prop({ required: true, min: 1, max: 5 })
  rating: number

  @Prop({ required: true })
  comment: string

  @Prop()
  avatar: string

  @Prop({ required: true, enum: ReviewStatus, default: ReviewStatus.PENDING })
  status: ReviewStatus

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Tour" })
  tour: Tour

  @Prop()
  response: string

  @Prop()
  responseDate: Date
}

export const ReviewSchema = SchemaFactory.createForClass(Review)

// Add text index for search functionality
ReviewSchema.index({ name: "text", email: "text", comment: "text", country: "text" })
