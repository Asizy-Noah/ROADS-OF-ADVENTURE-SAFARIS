// src/modules/pages/pages.module.ts
import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { PagesService } from "./pages.service"
import { PagesController } from "./pages.controller"
import { Page, PageSchema } from "./schemas/page.schema"
import { GoogleCloudStorageService } from "../google-cloud/google-cloud-storage.service"; 

@Module({
  imports: [MongooseModule.forFeature([{ name: Page.name, schema: PageSchema }])],
  controllers: [PagesController],
  providers: [
    PagesService,
    GoogleCloudStorageService, 
  ],
  exports: [PagesService],
})
export class PagesModule {}