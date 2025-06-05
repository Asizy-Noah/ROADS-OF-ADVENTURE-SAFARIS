import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

@Schema({ timestamps: true })
export class Subscriber extends Document {
  @Prop()
  name: string

  @Prop({ required: true, unique: true })
  email: string

  @Prop()
  phoneNumber: string

  @Prop({ default: true })
  isActive: boolean
}

export const SubscriberSchema = SchemaFactory.createForClass(Subscriber)

// Add text index for search functionality
SubscriberSchema.index({ name: "text", email: "text", phoneNumber: "text" })
