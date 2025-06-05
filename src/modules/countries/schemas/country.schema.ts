import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"
import * as mongoose from "mongoose"
import type { User } from "../../users/schemas/user.schema"

@Schema({ timestamps: true })
export class Country extends Document {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  code: string

  @Prop({ required: true, unique: true })
  slug: string

  @Prop({ required: true })
  overview: string

  @Prop({ required: true })
  description: string

  @Prop()
  summary: string

  @Prop()
  coverImage: string

  @Prop([String])
  galleryImages: string[]

  // SEO fields
  @Prop()
  seoTitle: string

  @Prop()
  seoDescription: string

  @Prop()
  seoKeywords: string

  @Prop()
  seoCanonicalUrl: string

  @Prop()
  seoOgImage: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  createdBy: User

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  updatedBy: User
}

export const CountrySchema = SchemaFactory.createForClass(Country)

// Add text index for search functionality
CountrySchema.index({ name: "text", overview: "text", description: "text", seoKeywords: "text" })
