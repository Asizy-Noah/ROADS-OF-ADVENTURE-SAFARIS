/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.controller.ts":
/*!*******************************!*\
  !*** ./src/app.controller.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const express_1 = __webpack_require__(/*! express */ "express");
const app_service_1 = __webpack_require__(/*! ./app.service */ "./src/app.service.ts");
const tours_service_1 = __webpack_require__(/*! ./modules/tours/tours.service */ "./src/modules/tours/tours.service.ts");
const countries_service_1 = __webpack_require__(/*! ./modules/countries/countries.service */ "./src/modules/countries/countries.service.ts");
const categories_service_1 = __webpack_require__(/*! ./modules/categories/categories.service */ "./src/modules/categories/categories.service.ts");
const blogs_service_1 = __webpack_require__(/*! ./modules/blogs/blogs.service */ "./src/modules/blogs/blogs.service.ts");
const reviews_service_1 = __webpack_require__(/*! ./modules/reviews/reviews.service */ "./src/modules/reviews/reviews.service.ts");
const pages_service_1 = __webpack_require__(/*! ./modules/pages/pages.service */ "./src/modules/pages/pages.service.ts");
const subscribers_service_1 = __webpack_require__(/*! ./modules/subscribers/subscribers.service */ "./src/modules/subscribers/subscribers.service.ts");
const blog_schema_1 = __webpack_require__(/*! ./modules/blogs/schemas/blog.schema */ "./src/modules/blogs/schemas/blog.schema.ts");
const page_schema_1 = __webpack_require__(/*! ./modules/pages/schemas/page.schema */ "./src/modules/pages/schemas/page.schema.ts");
const mail_service_1 = __webpack_require__(/*! ./modules/mail/mail.service */ "./src/modules/mail/mail.service.ts");
const enquiry_dto_1 = __webpack_require__(/*! ./modules/enquiry/dtos/enquiry.dto */ "./src/modules/enquiry/dtos/enquiry.dto.ts");
let AppController = class AppController {
    constructor(appService, toursService, countriesService, categoriesService, blogsService, reviewsService, pagesService, subscribersService, mailService) {
        this.appService = appService;
        this.toursService = toursService;
        this.countriesService = countriesService;
        this.categoriesService = categoriesService;
        this.blogsService = blogsService;
        this.reviewsService = reviewsService;
        this.pagesService = pagesService;
        this.subscribersService = subscribersService;
        this.mailService = mailService;
    }
    async getHomePage(pageQuery = '1') {
        var _a;
        const page = parseInt(pageQuery, 10);
        const limit = 4;
        const aboutUsPage = await this.pagesService.findOneByType(page_schema_1.PageType.ABOUT);
        const featuredTours = await this.toursService.findFeatured();
        const result = await this.countriesService.findAll();
        const countries = Array.isArray(result) ? result : (_a = result.data) !== null && _a !== void 0 ? _a : [];
        const reviews = await this.reviewsService.findApproved();
        const { blogs, totalBlogs, currentPage, totalPages } = await this.blogsService.findAll({
            page: page,
            limit: limit,
            sortBy: 'newest',
            status: blog_schema_1.BlogStatus.VISIBLE,
        });
        return {
            title: "Roads of Adventure Safaris - African Safari Tours",
            aboutUsPage,
            featuredTours,
            countries,
            blogs,
            reviews,
            currentPage,
            totalPages,
            layout: "layouts/public",
        };
    }
    async getPage(slug) {
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
    async subscribe(query, res) {
        try {
            await this.subscribersService.create({
                name: query.name,
                email: query.email,
                phoneNumber: query.phone,
            });
            return res.redirect(query.redirect || "/?subscribed=true");
        }
        catch (error) {
            return res.redirect(query.redirect || "/?subscribed=false");
        }
    }
    async getUnsubscribePage(email) {
        return {
            title: 'Unsubscribe - Roads of Adventure Safaris',
            email,
            layout: 'layouts/public',
        };
    }
    async unsubscribe(email, res) {
        try {
            const subscribers = await this.subscribersService.findAll({ search: email });
            if (subscribers.length > 0) {
                await this.subscribersService.remove(subscribers[0]._id);
            }
            return res.redirect("/?unsubscribed=true");
        }
        catch (error) {
            return res.redirect("/?unsubscribed=false");
        }
    }
    getEnquiryPage() {
        return {
            title: "Enquiry - Roads of Adventure Safaris",
            layout: "layouts/public",
        };
    }
    async submitEnquiry(createEnquiryDto, res) {
        try {
            await this.mailService.sendEnquiryToAdmin(createEnquiryDto);
            return res.redirect('/enquiry?success=true');
        }
        catch (error) {
            console.error('Error submitting enquiry:', error);
            return res.redirect('/enquiry?success=false');
        }
    }
    async getImpactPage() {
        const impactPage = await this.pagesService.findOneByType(page_schema_1.PageType.COMMUNITY);
        if (!impactPage) {
            throw new common_1.NotFoundException('Impact page not found.');
        }
        return {
            title: impactPage.seoTitle || `${impactPage.title} - Roads of Adventure Safaris`,
            impactPage,
            layout: "layouts/public",
            seo: {
                title: impactPage.seoTitle || `${impactPage.title} - Roads of Adventure Safaris`,
                description: impactPage.seoDescription || impactPage.description,
                keywords: impactPage.seoKeywords,
                canonicalUrl: impactPage.seoCanonicalUrl,
                ogImage: impactPage.seoOgImage || impactPage.coverImage,
            },
        };
    }
    async getTermsPage() {
        const termsPage = await this.pagesService.findOneByType(page_schema_1.PageType.TERMS);
        if (!termsPage) {
            throw new common_1.NotFoundException('Terms and Conditions page not found.');
        }
        return {
            title: termsPage.seoTitle || `${termsPage.title} - Roads of Adventure Safaris`,
            termsPage,
            layout: "layouts/public",
            seo: {
                title: termsPage.seoTitle || `${termsPage.title} - Roads of Adventure Safaris`,
                description: termsPage.seoDescription || termsPage.description,
                keywords: termsPage.seoKeywords,
                canonicalUrl: termsPage.seoCanonicalUrl,
                ogImage: termsPage.seoOgImage || termsPage.coverImage,
            },
        };
    }
    async getPrivacyPolicyPage() {
        const privacyPage = await this.pagesService.findOneByType(page_schema_1.PageType.PRIVACY);
        if (!privacyPage) {
            throw new common_1.NotFoundException('Privacy Policy page not found.');
        }
        return {
            title: privacyPage.seoTitle || `${privacyPage.title} - Roads of Adventure Safaris`,
            privacyPage,
            layout: "layouts/public",
            seo: {
                title: privacyPage.seoTitle || `${privacyPage.title} - Roads of Adventure Safaris`,
                description: privacyPage.seoDescription || privacyPage.description,
                keywords: privacyPage.seoKeywords,
                canonicalUrl: privacyPage.seoCanonicalUrl,
                ogImage: privacyPage.seoOgImage || privacyPage.coverImage,
            },
        };
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.Render)("public/index"),
    __param(0, (0, common_1.Query)('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getHomePage", null);
__decorate([
    (0, common_1.Get)('page/:slug'),
    (0, common_1.Render)('public/page'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getPage", null);
__decorate([
    (0, common_1.Get)("subscribe"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_k = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _k : Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "subscribe", null);
__decorate([
    (0, common_1.Get)('unsubscribe'),
    (0, common_1.Render)('public/unsubscribe'),
    __param(0, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getUnsubscribePage", null);
__decorate([
    (0, common_1.Get)("unsubscribe/confirm"),
    __param(0, (0, common_1.Query)('email')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_l = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _l : Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "unsubscribe", null);
__decorate([
    (0, common_1.Get)('enquiry'),
    (0, common_1.Render)('public/enquiry'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AppController.prototype, "getEnquiryPage", null);
__decorate([
    (0, common_1.Post)('enquiry'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_m = typeof enquiry_dto_1.CreateEnquiryDto !== "undefined" && enquiry_dto_1.CreateEnquiryDto) === "function" ? _m : Object, typeof (_o = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _o : Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "submitEnquiry", null);
__decorate([
    (0, common_1.Get)('impact'),
    (0, common_1.Render)('public/impact'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getImpactPage", null);
__decorate([
    (0, common_1.Get)('terms'),
    (0, common_1.Render)('public/terms'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getTermsPage", null);
__decorate([
    (0, common_1.Get)('privacy-policy'),
    (0, common_1.Render)('public/privacy-policy'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getPrivacyPolicyPage", null);
AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object, typeof (_b = typeof tours_service_1.ToursService !== "undefined" && tours_service_1.ToursService) === "function" ? _b : Object, typeof (_c = typeof countries_service_1.CountriesService !== "undefined" && countries_service_1.CountriesService) === "function" ? _c : Object, typeof (_d = typeof categories_service_1.CategoriesService !== "undefined" && categories_service_1.CategoriesService) === "function" ? _d : Object, typeof (_e = typeof blogs_service_1.BlogsService !== "undefined" && blogs_service_1.BlogsService) === "function" ? _e : Object, typeof (_f = typeof reviews_service_1.ReviewsService !== "undefined" && reviews_service_1.ReviewsService) === "function" ? _f : Object, typeof (_g = typeof pages_service_1.PagesService !== "undefined" && pages_service_1.PagesService) === "function" ? _g : Object, typeof (_h = typeof subscribers_service_1.SubscribersService !== "undefined" && subscribers_service_1.SubscribersService) === "function" ? _h : Object, typeof (_j = typeof mail_service_1.MailService !== "undefined" && mail_service_1.MailService) === "function" ? _j : Object])
], AppController);
exports.AppController = AppController;


/***/ }),

/***/ "./src/app.module.ts":
/*!***************************!*\
  !*** ./src/app.module.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const serve_static_1 = __webpack_require__(/*! @nestjs/serve-static */ "@nestjs/serve-static");
const path_1 = __webpack_require__(/*! path */ "path");
const app_controller_1 = __webpack_require__(/*! ./app.controller */ "./src/app.controller.ts");
const app_service_1 = __webpack_require__(/*! ./app.service */ "./src/app.service.ts");
const auth_module_1 = __webpack_require__(/*! ./modules/auth/auth.module */ "./src/modules/auth/auth.module.ts");
const users_module_1 = __webpack_require__(/*! ./modules/users/users.module */ "./src/modules/users/users.module.ts");
const countries_module_1 = __webpack_require__(/*! ./modules/countries/countries.module */ "./src/modules/countries/countries.module.ts");
const categories_module_1 = __webpack_require__(/*! ./modules/categories/categories.module */ "./src/modules/categories/categories.module.ts");
const tours_module_1 = __webpack_require__(/*! ./modules/tours/tours.module */ "./src/modules/tours/tours.module.ts");
const blogs_module_1 = __webpack_require__(/*! ./modules/blogs/blogs.module */ "./src/modules/blogs/blogs.module.ts");
const reviews_module_1 = __webpack_require__(/*! ./modules/reviews/reviews.module */ "./src/modules/reviews/reviews.module.ts");
const subscribers_module_1 = __webpack_require__(/*! ./modules/subscribers/subscribers.module */ "./src/modules/subscribers/subscribers.module.ts");
const pages_module_1 = __webpack_require__(/*! ./modules/pages/pages.module */ "./src/modules/pages/pages.module.ts");
const bookings_module_1 = __webpack_require__(/*! ./modules/bookings/bookings.module */ "./src/modules/bookings/bookings.module.ts");
const mail_module_1 = __webpack_require__(/*! ./modules/mail/mail.module */ "./src/modules/mail/mail.module.ts");
const dashboard_module_1 = __webpack_require__(/*! ./modules/dashboard/dashboard.module */ "./src/modules/dashboard/dashboard.module.ts");
const header_data_middleware_1 = __webpack_require__(/*! ./common/middleware/header-data.middleware */ "./src/common/middleware/header-data.middleware.ts");
const footer_data_middleware_1 = __webpack_require__(/*! ./common/middleware/footer-data.middleware */ "./src/common/middleware/footer-data.middleware.ts");
let AppModule = class AppModule {
    configure(consumer) {
        consumer
            .apply(header_data_middleware_1.HeaderDataMiddleware)
            .forRoutes({ path: '*', method: common_1.RequestMethod.GET });
        consumer
            .apply(footer_data_middleware_1.FooterDataMiddleware)
            .forRoutes('*');
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ".env",
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    uri: configService.get("MONGODB_URI") || "mongodb://localhost/roads-of-adventure",
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                }),
                inject: [config_1.ConfigService],
            }),
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, "..", "public"),
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            countries_module_1.CountriesModule,
            categories_module_1.CategoriesModule,
            tours_module_1.ToursModule,
            blogs_module_1.BlogsModule,
            reviews_module_1.ReviewsModule,
            subscribers_module_1.SubscribersModule,
            pages_module_1.PagesModule,
            bookings_module_1.BookingsModule,
            mail_module_1.MailModule,
            dashboard_module_1.DashboardModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),

/***/ "./src/app.service.ts":
/*!****************************!*\
  !*** ./src/app.service.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let AppService = class AppService {
    getHello() {
        return "Welcome to Roads of Adventure Safaris API!";
    }
};
AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
exports.AppService = AppService;


/***/ }),

/***/ "./src/common/middleware/footer-data.middleware.ts":
/*!*********************************************************!*\
  !*** ./src/common/middleware/footer-data.middleware.ts ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FooterDataMiddleware = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const countries_service_1 = __webpack_require__(/*! ../../modules/countries/countries.service */ "./src/modules/countries/countries.service.ts");
let FooterDataMiddleware = class FooterDataMiddleware {
    constructor(countriesService) {
        this.countriesService = countriesService;
    }
    async use(req, res, next) {
        try {
            const countriesResult = await this.countriesService.findAll({
                limit: '10',
            });
            const popularFooterCountries = countriesResult.data;
            if (popularFooterCountries && Array.isArray(popularFooterCountries)) {
                popularFooterCountries.sort((a, b) => a.name.localeCompare(b.name));
            }
            else {
                res.locals.popularFooterCountries = [];
                next();
                return;
            }
            res.locals.popularFooterCountries = popularFooterCountries;
        }
        catch (error) {
            console.error('Error fetching footer countries in middleware:', error);
            res.locals.popularFooterCountries = [];
        }
        next();
    }
};
FooterDataMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof countries_service_1.CountriesService !== "undefined" && countries_service_1.CountriesService) === "function" ? _a : Object])
], FooterDataMiddleware);
exports.FooterDataMiddleware = FooterDataMiddleware;


/***/ }),

/***/ "./src/common/middleware/header-data.middleware.ts":
/*!*********************************************************!*\
  !*** ./src/common/middleware/header-data.middleware.ts ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HeaderDataMiddleware = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const countries_service_1 = __webpack_require__(/*! ../../modules/countries/countries.service */ "./src/modules/countries/countries.service.ts");
let HeaderDataMiddleware = class HeaderDataMiddleware {
    constructor(countriesService) {
        this.countriesService = countriesService;
    }
    async use(req, res, next) {
        const staticCountries = await this.countriesService.findStaticHeaderCountries();
        const otherCountries = await this.countriesService.findOtherHeaderCountries();
        res.locals.headerStaticCountries = staticCountries;
        res.locals.headerOtherCountries = otherCountries;
        next();
    }
};
HeaderDataMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof countries_service_1.CountriesService !== "undefined" && countries_service_1.CountriesService) === "function" ? _a : Object])
], HeaderDataMiddleware);
exports.HeaderDataMiddleware = HeaderDataMiddleware;


/***/ }),

/***/ "./src/config/multer.config.ts":
/*!*************************************!*\
  !*** ./src/config/multer.config.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getMulterConfig = void 0;
const multer_1 = __webpack_require__(/*! multer */ "multer");
const path_1 = __webpack_require__(/*! path */ "path");
const uuid_1 = __webpack_require__(/*! uuid */ "uuid");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const fs = __importStar(__webpack_require__(/*! fs */ "fs"));
const baseUploadDir = "./uploads";
const getMulterConfig = (subfolder) => {
    const uploadDir = `${baseUploadDir}/${subfolder}`;
    if (!fs.existsSync(baseUploadDir)) {
        fs.mkdirSync(baseUploadDir, { recursive: true });
    }
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    return {
        storage: (0, multer_1.diskStorage)({
            destination: uploadDir,
            filename: (req, file, callback) => {
                const uniqueSuffix = (0, uuid_1.v4)();
                const ext = (0, path_1.extname)(file.originalname);
                const filename = `${uniqueSuffix}${ext}`;
                callback(null, filename);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                return callback(new common_1.HttpException("Only image files are allowed!", common_1.HttpStatus.BAD_REQUEST), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    };
};
exports.getMulterConfig = getMulterConfig;


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
const path_1 = __webpack_require__(/*! path */ "path");
const express_session_1 = __importDefault(__webpack_require__(/*! express-session */ "express-session"));
const passport_1 = __importDefault(__webpack_require__(/*! passport */ "passport"));
const connect_flash_1 = __importDefault(__webpack_require__(/*! connect-flash */ "connect-flash"));
const express_ejs_layouts_1 = __importDefault(__webpack_require__(/*! express-ejs-layouts */ "express-ejs-layouts"));
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const app_module_1 = __webpack_require__(/*! ./app.module */ "./src/app.module.ts");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const crypto_1 = __importDefault(__webpack_require__(/*! crypto */ "crypto"));
const method_override_1 = __importDefault(__webpack_require__(/*! method-override */ "method-override"));
const express = __importStar(__webpack_require__(/*! express */ "express"));
const connect_mongo_1 = __importDefault(__webpack_require__(/*! connect-mongo */ "connect-mongo"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.set("trust proxy", 1);
    app.setBaseViewsDir((0, path_1.join)(__dirname, "..", "views"));
    app.setViewEngine("ejs");
    app.use(express_ejs_layouts_1.default);
    app.set("layout", "layouts/public");
    const mongoUri = configService.get("MONGODB_URI");
    if (!mongoUri) {
        throw new Error("MONGODB_URI is not defined in the environment variables.");
    }
    const MongoStore = connect_mongo_1.default.create({
        mongoUrl: mongoUri,
        collectionName: 'sessions',
    });
    app.use((0, express_session_1.default)({
        secret: configService.get("SESSION_SECRET") ||
            crypto_1.default.randomUUID(),
        resave: false,
        saveUninitialized: false,
        store: MongoStore,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            sameSite: "lax",
        },
    }));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    app.useStaticAssets((0, path_1.join)(__dirname, "..", "public"));
    app.useStaticAssets((0, path_1.join)(__dirname, "..", "uploads"), {
        prefix: '/uploads',
    });
    app.use((0, connect_flash_1.default)());
    app.use((req, res, next) => {
        var _a;
        res.locals.success_msg = req.flash("success_msg");
        res.locals.error_msg = req.flash("error_msg");
        res.locals.error = req.flash("error");
        res.locals.user = ((_a = req.session) === null || _a === void 0 ? void 0 : _a.user) || null;
        next();
    });
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use((0, method_override_1.default)('_method'));
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    const port = configService.get("PORT") || 9090;
    await app.listen(port, '0.0.0.0', () => {
        console.log(`Application is running on: http://localhost:${port}`);
        console.log(`Accessible from network on: http://your_network_ip:${port}`);
    });
}
bootstrap();


/***/ }),

/***/ "./src/modules/auth/auth.controller.ts":
/*!*********************************************!*\
  !*** ./src/modules/auth/auth.controller.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const express_1 = __webpack_require__(/*! express */ "express");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/modules/auth/auth.service.ts");
const users_service_1 = __webpack_require__(/*! ../users/users.service */ "./src/modules/users/users.service.ts");
const create_user_dto_1 = __webpack_require__(/*! ../users/dto/create-user.dto */ "./src/modules/users/dto/create-user.dto.ts");
const login_user_dto_1 = __webpack_require__(/*! ../users/dto/login-user.dto */ "./src/modules/users/dto/login-user.dto.ts");
const forgot_password_dto_1 = __webpack_require__(/*! ../users/dto/forgot-password.dto */ "./src/modules/users/dto/forgot-password.dto.ts");
const reset_password_dto_1 = __webpack_require__(/*! ../users/dto/reset-password.dto */ "./src/modules/users/dto/reset-password.dto.ts");
const user_schema_1 = __webpack_require__(/*! ../users/schemas/user.schema */ "./src/modules/users/schemas/user.schema.ts");
const session_auth_guard_1 = __webpack_require__(/*! ./guards/session-auth.guard */ "./src/modules/auth/guards/session-auth.guard.ts");
let AuthController = class AuthController {
    constructor(authService, usersService) {
        this.authService = authService;
        this.usersService = usersService;
    }
    getRegisterPage() {
        return {
            title: "Register - Roads of Adventure Safaris",
            layout: "layouts/auth",
        };
    }
    async register(createUserDto, req, res) {
        try {
            const user = await this.usersService.create(createUserDto);
            if (user.role === user_schema_1.UserRole.AGENT) {
                req.flash("success_msg", "Registration successful! Please login.");
                return res.redirect("/auth/login");
            }
            else {
                req.session.user = {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                };
                return res.redirect("/dashboard/pending-approval");
            }
        }
        catch (error) {
            req.flash("error_msg", error.message);
            return res.redirect("/auth/register");
        }
    }
    getLoginPage() {
        return {
            title: "Login - Roads of Adventure Safaris",
            layout: "layouts/auth",
        };
    }
    async login(loginUserDto, req, res) {
        try {
            const result = await this.authService.login(loginUserDto);
            req.session.user = result.user;
            if (result.status === "pending") {
                return res.redirect("/auth/pending-approval");
            }
            const redirectUrl = result.user.role === user_schema_1.UserRole.ADMIN ? "/dashboard/index" : "/dashboard/index";
            return res.redirect(redirectUrl);
        }
        catch (error) {
            req.flash("error_msg", error.message);
            return res.redirect("/auth/login");
        }
    }
    getPendingApprovalPage(req) {
        return {
            title: "Pending Approval - Roads of Adventure Safaris",
            user: req.session.user,
            layout: "layouts/auth",
        };
    }
    logout(req, res) {
        req.session.destroy(() => {
            res.redirect("/auth/login");
        });
    }
    getForgotPasswordPage() {
        return {
            title: "Forgot Password - Roads of Adventure Safaris",
            layout: "layouts/auth",
        };
    }
    async forgotPassword(forgotPasswordDto, req, res) {
        try {
            await this.usersService.createForgotPasswordToken(forgotPasswordDto.email);
            req.flash("success_msg", "A password reset link has been sent to your email");
            return res.redirect("/auth/login");
        }
        catch (error) {
            req.flash("error_msg", error.message);
            return res.redirect("/auth/forgot-password");
        }
    }
    getResetPasswordPage(req) {
        return {
            title: "Reset Password - Roads of Adventure Safaris",
            token: req.params.token,
            layout: "layouts/auth",
        };
    }
    async resetPassword(resetPasswordDto, req, res) {
        try {
            await this.usersService.resetPassword(resetPasswordDto.token, resetPasswordDto.password, resetPasswordDto.confirmPassword);
            req.flash("success_msg", "Your password has been updated! Please login.");
            return res.redirect("/auth/login");
        }
        catch (error) {
            req.flash("error_msg", error.message);
            return res.redirect(`/auth/reset-password/${resetPasswordDto.token}`);
        }
    }
};
__decorate([
    (0, common_1.Get)("register"),
    (0, common_1.Render)("auth/register"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getRegisterPage", null);
__decorate([
    (0, common_1.Post)("register"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof create_user_dto_1.CreateUserDto !== "undefined" && create_user_dto_1.CreateUserDto) === "function" ? _c : Object, Object, typeof (_d = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Get)("login"),
    (0, common_1.Render)("auth/login"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getLoginPage", null);
__decorate([
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof login_user_dto_1.LoginUserDto !== "undefined" && login_user_dto_1.LoginUserDto) === "function" ? _e : Object, Object, typeof (_f = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard),
    (0, common_1.Get)("pending-approval"),
    (0, common_1.Render)("auth/pending-approval"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getPendingApprovalPage", null);
__decorate([
    (0, common_1.Get)("logout"),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_g = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _g : Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)("forgot-password"),
    (0, common_1.Render)("auth/forgot-password"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getForgotPasswordPage", null);
__decorate([
    (0, common_1.Post)("forgot-password"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof forgot_password_dto_1.ForgotPasswordDto !== "undefined" && forgot_password_dto_1.ForgotPasswordDto) === "function" ? _h : Object, Object, typeof (_j = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _j : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Get)("reset-password/:token"),
    (0, common_1.Render)("auth/reset-password"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getResetPasswordPage", null);
__decorate([
    (0, common_1.Post)("reset-password"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_k = typeof reset_password_dto_1.ResetPasswordDto !== "undefined" && reset_password_dto_1.ResetPasswordDto) === "function" ? _k : Object, Object, typeof (_l = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _l : Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object, typeof (_b = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _b : Object])
], AuthController);
exports.AuthController = AuthController;


/***/ }),

/***/ "./src/modules/auth/auth.module.ts":
/*!*****************************************!*\
  !*** ./src/modules/auth/auth.module.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const auth_service_1 = __webpack_require__(/*! ./auth.service */ "./src/modules/auth/auth.service.ts");
const auth_controller_1 = __webpack_require__(/*! ./auth.controller */ "./src/modules/auth/auth.controller.ts");
const users_module_1 = __webpack_require__(/*! ../users/users.module */ "./src/modules/users/users.module.ts");
const mail_module_1 = __webpack_require__(/*! ../mail/mail.module */ "./src/modules/mail/mail.module.ts");
const local_strategy_1 = __webpack_require__(/*! ./strategies/local.strategy */ "./src/modules/auth/strategies/local.strategy.ts");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            users_module_1.UsersModule,
            passport_1.PassportModule.register({ session: true }),
            mail_module_1.MailModule,
            config_1.ConfigModule,
        ],
        providers: [
            auth_service_1.AuthService,
            local_strategy_1.LocalStrategy,
        ],
        controllers: [auth_controller_1.AuthController],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
exports.AuthModule = AuthModule;


/***/ }),

/***/ "./src/modules/auth/auth.service.ts":
/*!******************************************!*\
  !*** ./src/modules/auth/auth.service.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const users_service_1 = __webpack_require__(/*! ../users/users.service */ "./src/modules/users/users.service.ts");
const user_schema_1 = __webpack_require__(/*! ../users/schemas/user.schema */ "./src/modules/users/schemas/user.schema.ts");
const passport_1 = __importDefault(__webpack_require__(/*! passport */ "passport"));
let AuthService = class AuthService {
    constructor(usersService) {
        this.usersService = usersService;
        passport_1.default.serializeUser((user, done) => {
            done(null, user._id);
        });
        passport_1.default.deserializeUser(async (id, done) => {
            try {
                const user = await this.usersService.findById(id);
                if (!user) {
                    return done(new common_1.UnauthorizedException('User not found during deserialization'), null);
                }
                done(null, user);
            }
            catch (error) {
                done(error, null);
            }
        });
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            return null;
        const isPasswordValid = await user.comparePassword(password);
        if (isPasswordValid) {
            const _a = user.toObject(), { password } = _a, result = __rest(_a, ["password"]);
            return result;
        }
        return null;
    }
    async login(loginUserDto) {
        const user = await this.usersService.findByEmail(loginUserDto.email);
        if (!user) {
            throw new common_1.UnauthorizedException("Invalid email or password");
        }
        const isPasswordValid = await user.comparePassword(loginUserDto.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException("Invalid email or password");
        }
        if (user.status === user_schema_1.UserStatus.PENDING) {
            return {
                status: "pending",
                message: "Your account is pending approval from admin",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    status: user.status,
                },
            };
        }
        if (user.status === user_schema_1.UserStatus.INACTIVE) {
            throw new common_1.UnauthorizedException("Your account has been deactivated. Please contact admin.");
        }
        return {
            status: "success",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
            },
        };
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object])
], AuthService);
exports.AuthService = AuthService;


/***/ }),

/***/ "./src/modules/auth/decorators/roles.decorator.ts":
/*!********************************************************!*\
  !*** ./src/modules/auth/decorators/roles.decorator.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Roles = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const Roles = (...roles) => (0, common_1.SetMetadata)("roles", roles);
exports.Roles = Roles;


/***/ }),

/***/ "./src/modules/auth/guards/roles.guard.ts":
/*!************************************************!*\
  !*** ./src/modules/auth/guards/roles.guard.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RolesGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const core_1 = __webpack_require__(/*! @nestjs/core */ "@nestjs/core");
let RolesGuard = class RolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride("roles", [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        return requiredRoles.some((role) => user.role === role);
    }
};
RolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof core_1.Reflector !== "undefined" && core_1.Reflector) === "function" ? _a : Object])
], RolesGuard);
exports.RolesGuard = RolesGuard;


/***/ }),

/***/ "./src/modules/auth/guards/session-auth.guard.ts":
/*!*******************************************************!*\
  !*** ./src/modules/auth/guards/session-auth.guard.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SessionAuthGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let SessionAuthGuard = class SessionAuthGuard {
    canActivate(context) {
        var _a;
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const response = ctx.getResponse();
        const sessionUser = (_a = request.session) === null || _a === void 0 ? void 0 : _a.user;
        if (!sessionUser) {
            response.redirect('/auth/login');
            return false;
        }
        request.user = sessionUser;
        return true;
    }
};
SessionAuthGuard = __decorate([
    (0, common_1.Injectable)()
], SessionAuthGuard);
exports.SessionAuthGuard = SessionAuthGuard;


/***/ }),

/***/ "./src/modules/auth/guards/user-ownership.guard.ts":
/*!*********************************************************!*\
  !*** ./src/modules/auth/guards/user-ownership.guard.ts ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserOwnershipGuard = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
let UserOwnershipGuard = class UserOwnershipGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const userIdFromRoute = request.params.id;
        const loggedInUserId = request.user.id;
        return userIdFromRoute === loggedInUserId;
    }
};
UserOwnershipGuard = __decorate([
    (0, common_1.Injectable)()
], UserOwnershipGuard);
exports.UserOwnershipGuard = UserOwnershipGuard;


/***/ }),

/***/ "./src/modules/auth/strategies/local.strategy.ts":
/*!*******************************************************!*\
  !*** ./src/modules/auth/strategies/local.strategy.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalStrategy = void 0;
const passport_local_1 = __webpack_require__(/*! passport-local */ "passport-local");
const passport_1 = __webpack_require__(/*! @nestjs/passport */ "@nestjs/passport");
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const auth_service_1 = __webpack_require__(/*! ../auth.service */ "./src/modules/auth/auth.service.ts");
let LocalStrategy = class LocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy) {
    constructor(authService) {
        super({
            usernameField: 'email',
        });
        this.authService = authService;
    }
    async validate(email, password) {
        const user = await this.authService.validateUser(email, password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return user;
    }
};
LocalStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], LocalStrategy);
exports.LocalStrategy = LocalStrategy;


/***/ }),

/***/ "./src/modules/blogs/blogs.controller.ts":
/*!***********************************************!*\
  !*** ./src/modules/blogs/blogs.controller.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BlogsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const platform_express_1 = __webpack_require__(/*! @nestjs/platform-express */ "@nestjs/platform-express");
const express_1 = __webpack_require__(/*! express */ "express");
const blogs_service_1 = __webpack_require__(/*! ./blogs.service */ "./src/modules/blogs/blogs.service.ts");
const session_auth_guard_1 = __webpack_require__(/*! ../auth/guards/session-auth.guard */ "./src/modules/auth/guards/session-auth.guard.ts");
const user_schema_1 = __webpack_require__(/*! ../users/schemas/user.schema */ "./src/modules/users/schemas/user.schema.ts");
const blog_schema_1 = __webpack_require__(/*! ./schemas/blog.schema */ "./src/modules/blogs/schemas/blog.schema.ts");
const multer_config_1 = __webpack_require__(/*! ../../config/multer.config */ "./src/config/multer.config.ts");
const countries_service_1 = __webpack_require__(/*! ../countries/countries.service */ "./src/modules/countries/countries.service.ts");
const tours_service_1 = __webpack_require__(/*! ../tours/tours.service */ "./src/modules/tours/tours.service.ts");
const categories_service_1 = __webpack_require__(/*! ../categories/categories.service */ "./src/modules/categories/categories.service.ts");
const roles_guard_1 = __webpack_require__(/*! ../auth/guards/roles.guard */ "./src/modules/auth/guards/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./src/modules/auth/decorators/roles.decorator.ts");
let BlogsController = class BlogsController {
    constructor(blogsService, countriesService, categoriesService, toursService) {
        this.blogsService = blogsService;
        this.countriesService = countriesService;
        this.categoriesService = categoriesService;
        this.toursService = toursService;
    }
    async getPublicAllBlogs(query) {
        const filterOptions = { status: blog_schema_1.BlogStatus.VISIBLE };
        if (query.search) {
            filterOptions.$or = [
                { title: { $regex: query.search, $options: 'i' } },
                { excerpt: { $regex: query.search, $options: 'i' } },
                { content: { $regex: query.search, $options: 'i' } }
            ];
        }
        if (query.category) {
            filterOptions.category = query.category;
        }
        if (query.tag) {
            filterOptions.tag = query.tag;
        }
        const { blogs, totalBlogs, currentPage, totalPages } = await this.blogsService.findAll(Object.assign(Object.assign({}, filterOptions), { page: query.page ? parseInt(query.page) : 1, limit: query.limit ? parseInt(query.limit) : 10, sortBy: query.sortBy || 'newest' }));
        const countriesResult = await this.countriesService.findAll({});
        const categoriesResult = await this.categoriesService.findAll({});
        const allTags = blogs.reduce((tags, blog) => {
            if (blog.tags && blog.tags.length) {
                return [...tags, ...blog.tags];
            }
            return tags;
        }, []);
        const uniqueTags = [...new Set(allTags)];
        return {
            title: "Safari Updates & Blog - Roads of Adventure Safaris",
            blogs,
            countries: countriesResult.data || [],
            categories: categoriesResult.data || [],
            tags: uniqueTags,
            query,
            currentPage,
            totalPages,
            layout: "layouts/public",
        };
    }
    async getDashboardBlogs(query, req) {
        const filters = {};
        const page = parseInt(query.page, 10) || 1;
        const limit = parseInt(query.limit, 10) || 10;
        if (query.status && query.status !== 'all' && Object.values(blog_schema_1.BlogStatus).includes(query.status)) {
            filters.status = query.status;
        }
        if (query.search) {
            filters.$or = [
                { title: { $regex: query.search, $options: 'i' } },
                { excerpt: { $regex: query.search, $options: 'i' } },
                { content: { $regex: query.search, $options: 'i' } }
            ];
        }
        if (query.category) {
            filters.categories = query.category;
        }
        if (query.country) {
            filters.countries = query.country;
        }
        if (query.tag) {
            filters.tags = query.tag;
        }
        if (req.user.role === user_schema_1.UserRole.AGENT) {
            filters.author = req.user.id;
        }
        try {
            const { blogs, totalBlogs, currentPage, totalPages } = await this.blogsService.findAll(Object.assign(Object.assign({}, filters), { page,
                limit, sortBy: query.sortBy || 'newest' }));
            const countriesResult = await this.countriesService.findAll({});
            const categoriesResult = await this.categoriesService.findAll({});
            const messages = req.flash();
            return {
                title: "Blogs - Dashboard",
                blogs,
                countries: countriesResult.data || [],
                categories: categoriesResult.data || [],
                user: req.user,
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
                blogStatuses: Object.values(blog_schema_1.BlogStatus),
            };
        }
        catch (error) {
            console.error("Error fetching dashboard blogs:", error);
            req.flash('error_msg', 'Failed to load dashboard blog posts: ' + error.message);
            return {
                blogs: [],
                query: { status: 'all', search: '', page: 1, limit: 10, sortBy: 'newest', category: '', country: '', tag: '' },
                currentPage: 1,
                totalPages: 0,
                messages: req.flash(),
                layout: "layouts/dashboard",
                blogStatuses: Object.values(blog_schema_1.BlogStatus),
                countries: [],
                categories: [],
                user: req.user,
            };
        }
    }
    async getAddBlogPage(req) {
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
            blogStatuses: Object.values(blog_schema_1.BlogStatus),
        };
    }
    async addBlog(createBlogDto, file, req, res) {
        try {
            if (file) {
                createBlogDto.coverImage = `/uploads/blogs/${file.filename}`;
            }
            else if (createBlogDto.coverImage === '') {
                createBlogDto.coverImage = null;
            }
            else {
                req.flash("error_msg", "Please upload a cover image.");
                req.flash('oldInput', createBlogDto);
                return res.redirect("/blogs/dashboard/add");
            }
            if (typeof createBlogDto.tags === "string") {
                createBlogDto.tags = createBlogDto.tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(tag => tag.length > 0);
            }
            else if (createBlogDto.tags === null || createBlogDto.tags === undefined) {
                createBlogDto.tags = [];
            }
            createBlogDto.author = req.user.id;
            createBlogDto.updatedBy = req.user.id;
            await this.blogsService.create(createBlogDto, req.user.id);
            req.flash("success_msg", "Blog added successfully");
            return res.redirect("/blogs/dashboard/blogs");
        }
        catch (error) {
            console.error('Error adding blog:', error);
            let flashMessage = "Failed to add blog post.";
            if (error instanceof common_1.HttpException) {
                const response = error.getResponse();
                if (typeof response === 'object' && response !== null && 'message' in response) {
                    if (Array.isArray(response.message)) {
                        flashMessage = response.message.join(', ');
                    }
                    else {
                        flashMessage = response.message;
                    }
                }
                else if (typeof response === 'string') {
                    flashMessage = response;
                }
                else {
                    flashMessage = error.message || "An unknown error occurred.";
                }
            }
            else if (error.message) {
                if (error.code === 11000 && error.keyPattern && error.keyValue) {
                    if (error.keyPattern.slug)
                        flashMessage = "A blog with this slug already exists. Please choose a different title or slug.";
                    else if (error.keyPattern.title)
                        flashMessage = "A blog with this title already exists.";
                    else
                        flashMessage = "A duplicate entry error occurred.";
                }
                else {
                    flashMessage = error.message;
                }
            }
            req.flash("error_msg", flashMessage);
            req.flash('oldInput', createBlogDto);
            return res.redirect("/blogs/dashboard/add");
        }
    }
    async getEditBlogPage(id, req, res) {
        try {
            const blog = await this.blogsService.findOne(id);
            if (!blog) {
                throw new common_1.NotFoundException(`Blog with ID ${id} not found.`);
            }
            if (req.user.role === user_schema_1.UserRole.AGENT && blog.author.toString() !== req.user.id) {
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
                blogStatuses: Object.values(blog_schema_1.BlogStatus),
            };
        }
        catch (error) {
            console.error('Error fetching blog for edit:', error);
            req.flash("error_msg", error.message || "Failed to load blog for editing.");
            return res.redirect("/blogs/dashboard/blogs");
        }
    }
    async updateBlog(id, updateBlogDto, file, req, res) {
        try {
            const existingBlog = await this.blogsService.findOne(id);
            if (!existingBlog) {
                throw new common_1.NotFoundException(`Blog with ID ${id} not found.`);
            }
            if (req.user.role === user_schema_1.UserRole.AGENT && existingBlog.author.toString() !== req.user.id) {
                req.flash("error_msg", "You are not authorized to update this blog");
                return res.redirect("/blogs/dashboard/blogs");
            }
            if (file) {
                updateBlogDto.coverImage = `/uploads/blogs/${file.filename}`;
            }
            else if (updateBlogDto.coverImage === '') {
                updateBlogDto.coverImage = null;
            }
            if (typeof updateBlogDto.tags === "string") {
                updateBlogDto.tags = updateBlogDto.tags.split(",").map((tag) => tag.trim()).filter(tag => tag.length > 0);
            }
            else if (updateBlogDto.tags === null || updateBlogDto.tags === undefined) {
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
            return res.redirect("/blogs/dashboard/blogs");
        }
        catch (error) {
            console.error('Error updating blog:', error);
            let flashMessage = "Failed to update blog.";
            if (error instanceof common_1.HttpException) {
                const response = error.getResponse();
                if (typeof response === 'object' && response !== null && 'message' in response) {
                    if (Array.isArray(response.message)) {
                        flashMessage = response.message.join(', ');
                    }
                    else {
                        flashMessage = response.message;
                    }
                }
                else if (typeof response === 'string') {
                    flashMessage = response;
                }
                else {
                    flashMessage = error.message || "An unknown error occurred.";
                }
            }
            else if (error.message) {
                if (error.code === 11000 && error.keyPattern && error.keyValue) {
                    if (error.keyPattern.slug)
                        flashMessage = "A blog with this slug already exists. Please choose a different title or slug.";
                    else if (error.keyPattern.title)
                        flashMessage = "A blog with this title already exists.";
                    else
                        flashMessage = "A duplicate entry error occurred.";
                }
                else {
                    flashMessage = error.message;
                }
            }
            req.flash("error_msg", flashMessage);
            req.flash('oldInput', updateBlogDto);
            return res.redirect(`/blogs/dashboard/edit/${id}`);
        }
    }
    async deleteBlog(id, req, res) {
        try {
            const blog = await this.blogsService.findOne(id);
            if (!blog) {
                throw new common_1.NotFoundException(`Blog with ID ${id} not found.`);
            }
            if (req.user.role === user_schema_1.UserRole.AGENT && blog.author.toString() !== req.user.id) {
                req.flash("error_msg", "You are not authorized to delete this blog");
                return res.redirect("/blogs/dashboard/blogs");
            }
            await this.blogsService.remove(id);
            req.flash("success_msg", "Blog deleted successfully");
            return res.redirect("/blogs/dashboard/blogs");
        }
        catch (error) {
            console.error('Error deleting blog:', error);
            req.flash("error_msg", error.message || "Failed to delete blog.");
            return res.redirect("/blogs/dashboard/blogs");
        }
    }
    async updateBlogStatus(id, status, req, res) {
        try {
            if (!Object.values(blog_schema_1.BlogStatus).includes(status)) {
                throw new common_1.BadRequestException(`Invalid blog status: ${status}`);
            }
            const blog = await this.blogsService.findOne(id);
            if (!blog) {
                throw new common_1.NotFoundException(`Blog with ID ${id} not found.`);
            }
            if (req.user.role === user_schema_1.UserRole.AGENT && blog.author.toString() !== req.user.id) {
                req.flash("error_msg", "You are not authorized to update this blog");
                return res.redirect("/blogs/dashboard/blogs");
            }
            await this.blogsService.updateStatus(id, status, req.user.id);
            req.flash("success_msg", `Blog status updated to ${status}`);
            return res.redirect("/blogs/dashboard/blogs");
        }
        catch (error) {
            console.error('Error updating blog status:', error);
            req.flash("error_msg", error.message || "Failed to update blog status.");
            return res.redirect("/blogs/dashboard/blogs");
        }
    }
    async getPublicSingleBlog(slug, req, res) {
        try {
            const blog = await this.blogsService.findBySlug(slug);
            if (!blog) {
                throw new common_1.NotFoundException(`Blog with slug '${slug}' not found or not visible.`);
            }
            const popularTours = await this.toursService.findPopular(10);
            const relatedBlogsResult = await this.blogsService.findAll({
                status: blog_schema_1.BlogStatus.VISIBLE,
                limit: 4,
            });
            const filteredRelatedBlogs = relatedBlogsResult.blogs.filter((relatedBlog) => relatedBlog._id.toString() !== blog._id.toString());
            return {
                title: `${blog.title} - Roads of Adventure Safaris`,
                blog,
                popularTours,
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
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                req.flash('error_msg', error.message);
                return res.redirect('/blogs');
            }
            console.error('Error loading public blog post:', error);
            req.flash('error_msg', 'An unexpected error occurred while loading the blog post.');
            return res.redirect('/blogs');
        }
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.Render)("public/blogs/index"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "getPublicAllBlogs", null);
__decorate([
    (0, common_1.Get)("dashboard/blogs"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.AGENT),
    (0, common_1.Render)("dashboard/blogs/index"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "getDashboardBlogs", null);
__decorate([
    (0, common_1.Get)("dashboard/add"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.AGENT),
    (0, common_1.Render)("dashboard/blogs/add"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "getAddBlogPage", null);
__decorate([
    (0, common_1.Post)("dashboard/add"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.AGENT),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("coverImage", (0, multer_config_1.getMulterConfig)('blogs'))),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_f = typeof Express !== "undefined" && (_e = Express.Multer) !== void 0 && _e.File) === "function" ? _f : Object, Object, typeof (_g = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _g : Object]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "addBlog", null);
__decorate([
    (0, common_1.Get)("dashboard/edit/:id"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.AGENT),
    (0, common_1.Render)("dashboard/blogs/edit"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_h = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "getEditBlogPage", null);
__decorate([
    (0, common_1.Patch)("dashboard/blogs/edit/:id"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.AGENT),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("coverImage", (0, multer_config_1.getMulterConfig)('blogs'))),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Req)()),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_k = typeof Express !== "undefined" && (_j = Express.Multer) !== void 0 && _j.File) === "function" ? _k : Object, Object, typeof (_l = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _l : Object]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "updateBlog", null);
__decorate([
    (0, common_1.Delete)("dashboard/blogs/:id"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.AGENT),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_m = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _m : Object]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "deleteBlog", null);
__decorate([
    (0, common_1.Patch)("dashboard/status/:id/:status"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.AGENT),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Param)("status")),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_o = typeof blog_schema_1.BlogStatus !== "undefined" && blog_schema_1.BlogStatus) === "function" ? _o : Object, Object, typeof (_p = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _p : Object]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "updateBlogStatus", null);
__decorate([
    (0, common_1.Get)(":slug"),
    (0, common_1.Render)("public/blogs/show"),
    __param(0, (0, common_1.Param)("slug")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_q = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _q : Object]),
    __metadata("design:returntype", Promise)
], BlogsController.prototype, "getPublicSingleBlog", null);
BlogsController = __decorate([
    (0, common_1.Controller)("blogs"),
    __metadata("design:paramtypes", [typeof (_a = typeof blogs_service_1.BlogsService !== "undefined" && blogs_service_1.BlogsService) === "function" ? _a : Object, typeof (_b = typeof countries_service_1.CountriesService !== "undefined" && countries_service_1.CountriesService) === "function" ? _b : Object, typeof (_c = typeof categories_service_1.CategoriesService !== "undefined" && categories_service_1.CategoriesService) === "function" ? _c : Object, typeof (_d = typeof tours_service_1.ToursService !== "undefined" && tours_service_1.ToursService) === "function" ? _d : Object])
], BlogsController);
exports.BlogsController = BlogsController;


/***/ }),

/***/ "./src/modules/blogs/blogs.module.ts":
/*!*******************************************!*\
  !*** ./src/modules/blogs/blogs.module.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BlogsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const blogs_service_1 = __webpack_require__(/*! ./blogs.service */ "./src/modules/blogs/blogs.service.ts");
const blogs_controller_1 = __webpack_require__(/*! ./blogs.controller */ "./src/modules/blogs/blogs.controller.ts");
const blog_schema_1 = __webpack_require__(/*! ./schemas/blog.schema */ "./src/modules/blogs/schemas/blog.schema.ts");
const mail_module_1 = __webpack_require__(/*! ../mail/mail.module */ "./src/modules/mail/mail.module.ts");
const subscribers_module_1 = __webpack_require__(/*! ../subscribers/subscribers.module */ "./src/modules/subscribers/subscribers.module.ts");
const countries_module_1 = __webpack_require__(/*! ../countries/countries.module */ "./src/modules/countries/countries.module.ts");
const categories_module_1 = __webpack_require__(/*! ../categories/categories.module */ "./src/modules/categories/categories.module.ts");
const tours_module_1 = __webpack_require__(/*! ../tours/tours.module */ "./src/modules/tours/tours.module.ts");
let BlogsModule = class BlogsModule {
};
BlogsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: blog_schema_1.Blog.name, schema: blog_schema_1.BlogSchema }]),
            mail_module_1.MailModule,
            subscribers_module_1.SubscribersModule,
            countries_module_1.CountriesModule,
            categories_module_1.CategoriesModule,
            tours_module_1.ToursModule,
        ],
        controllers: [blogs_controller_1.BlogsController],
        providers: [blogs_service_1.BlogsService],
        exports: [blogs_service_1.BlogsService],
    })
], BlogsModule);
exports.BlogsModule = BlogsModule;


/***/ }),

/***/ "./src/modules/blogs/blogs.service.ts":
/*!********************************************!*\
  !*** ./src/modules/blogs/blogs.service.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BlogsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const mongoose_2 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const blog_schema_1 = __webpack_require__(/*! ./schemas/blog.schema */ "./src/modules/blogs/schemas/blog.schema.ts");
const mail_service_1 = __webpack_require__(/*! ../mail/mail.service */ "./src/modules/mail/mail.service.ts");
const subscribers_service_1 = __webpack_require__(/*! ../subscribers/subscribers.service */ "./src/modules/subscribers/subscribers.service.ts");
let BlogsService = class BlogsService {
    constructor(blogModel, mailService, subscribersService) {
        this.blogModel = blogModel;
        this.mailService = mailService;
        this.subscribersService = subscribersService;
    }
    async create(createBlogDto, userId) {
        if (!createBlogDto.slug) {
            createBlogDto.slug = createBlogDto.title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-');
        }
        const existingBlog = await this.blogModel.findOne({
            $or: [{ title: createBlogDto.title }, { slug: createBlogDto.slug }],
        });
        if (existingBlog) {
            throw new common_1.ConflictException("Blog with this title or slug already exists.");
        }
        const newBlog = new this.blogModel(Object.assign(Object.assign({}, createBlogDto), { author: userId, updatedBy: userId }));
        const savedBlog = await newBlog.save();
        if (savedBlog.status === blog_schema_1.BlogStatus.VISIBLE) {
            const subscribers = await this.subscribersService.findAll();
        }
        return savedBlog;
    }
    async findAll(queryOptions) {
        const filter = {};
        const sort = {};
        const page = (queryOptions === null || queryOptions === void 0 ? void 0 : queryOptions.page) ? parseInt(queryOptions.page.toString(), 10) : 1;
        const limit = (queryOptions === null || queryOptions === void 0 ? void 0 : queryOptions.limit) ? parseInt(queryOptions.limit.toString(), 10) : 10;
        const skip = (page - 1) * limit;
        for (const key in queryOptions) {
            if (queryOptions.hasOwnProperty(key) && !['search', 'sortBy', 'page', 'limit'].includes(key)) {
                if (key.startsWith('$')) {
                    filter[key] = queryOptions[key];
                }
                else if (key === 'status' && queryOptions[key] !== 'all') {
                    filter[key] = queryOptions[key];
                }
                else if (key === 'author' || key === 'category' || key === 'country') {
                    if (mongoose_1.Types.ObjectId.isValid(queryOptions[key])) {
                        filter[key] = new mongoose_1.Types.ObjectId(queryOptions[key]);
                    }
                }
                else if (key === 'tag') {
                    filter.tags = queryOptions[key];
                }
                else {
                    filter[key] = queryOptions[key];
                }
            }
        }
        if ((queryOptions === null || queryOptions === void 0 ? void 0 : queryOptions.search) && !filter.$or) {
            filter.$or = [
                { title: { $regex: queryOptions.search, $options: 'i' } },
                { excerpt: { $regex: queryOptions.search, $options: 'i' } },
                { content: { $regex: queryOptions.search, $options: 'i' } }
            ];
        }
        switch (queryOptions === null || queryOptions === void 0 ? void 0 : queryOptions.sortBy) {
            case 'oldest':
                sort.createdAt = 1;
                break;
            case 'title-asc':
                sort.title = 1;
                break;
            case 'title-desc':
                sort.title = -1;
                break;
            case 'newest':
            default:
                sort.createdAt = -1;
                break;
        }
        const [blogs, totalBlogs] = await Promise.all([
            this.blogModel
                .find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate("categories", "name slug")
                .populate("author", "name email")
                .exec(),
            this.blogModel.countDocuments(filter).exec(),
        ]);
        const totalPages = Math.ceil(totalBlogs / limit);
        return {
            blogs,
            totalBlogs,
            currentPage: page,
            totalPages,
        };
    }
    async findPublished(limit) {
        const query = this.blogModel
            .find({ status: blog_schema_1.BlogStatus.VISIBLE })
            .sort({ createdAt: -1 })
            .populate("categories", "name slug")
            .populate("author", "name email");
        if (limit) {
            query.limit(limit);
        }
        return query.exec();
    }
    async findOne(id) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`Invalid ID format for blog: ${id}`);
        }
        const blog = await this.blogModel
            .findById(id)
            .populate("categories", "name slug")
            .populate("author", "name email")
            .exec();
        if (!blog) {
            throw new common_1.NotFoundException(`Blog with ID ${id} not found.`);
        }
        return blog;
    }
    async findBySlug(slug) {
        const blog = await this.blogModel
            .findOne({ slug, status: blog_schema_1.BlogStatus.VISIBLE })
            .populate("categories", "name slug")
            .populate("author", "name email")
            .exec();
        if (!blog) {
            throw new common_1.NotFoundException(`Blog with slug '${slug}' not found or not visible.`);
        }
        return blog;
    }
    async update(id, updateBlogDto, userId) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`Invalid ID format for blog update: ${id}`);
        }
        if (updateBlogDto.slug) {
            const existingBlog = await this.blogModel.findOne({
                slug: updateBlogDto.slug,
                _id: { $ne: id },
            });
            if (existingBlog) {
                throw new common_1.ConflictException("Blog with this slug already exists.");
            }
        }
        const blog = await this.blogModel.findById(id).exec();
        if (!blog) {
            throw new common_1.NotFoundException(`Blog with ID ${id} not found.`);
        }
        if (updateBlogDto.tags && typeof updateBlogDto.tags === 'string') {
            updateBlogDto.tags = updateBlogDto.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        }
        else if (updateBlogDto.tags === null || updateBlogDto.tags === undefined) {
            updateBlogDto.tags = [];
        }
        const processedUpdateDto = Object.assign({}, updateBlogDto);
        if (processedUpdateDto.categories && !Array.isArray(processedUpdateDto.categories)) {
            processedUpdateDto.categories = [processedUpdateDto.categories].filter(id => mongoose_1.Types.ObjectId.isValid(id)).map(id => new mongoose_1.Types.ObjectId(id));
        }
        else if (processedUpdateDto.categories) {
            processedUpdateDto.categories = processedUpdateDto.categories.filter(id => mongoose_1.Types.ObjectId.isValid(id)).map(id => new mongoose_1.Types.ObjectId(id));
        }
        else {
            processedUpdateDto.categories = [];
        }
        const isPublishing = blog.status !== blog_schema_1.BlogStatus.VISIBLE && processedUpdateDto.status === blog_schema_1.BlogStatus.VISIBLE;
        Object.assign(blog, processedUpdateDto);
        blog.updatedBy = new mongoose_1.Types.ObjectId(userId);
        const updatedBlog = await blog.save();
        if (isPublishing) {
            const subscribers = await this.subscribersService.findAll();
        }
        return updatedBlog;
    }
    async remove(id) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`Invalid ID format for blog deletion: ${id}`);
        }
        const deletedBlog = await this.blogModel.findByIdAndDelete(id).exec();
        if (!deletedBlog) {
            throw new common_1.NotFoundException(`Blog with ID ${id} not found.`);
        }
        return deletedBlog;
    }
    async updateStatus(id, status, userId) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException(`Invalid ID format for status update: ${id}`);
        }
        const blog = await this.blogModel.findById(id).exec();
        if (!blog) {
            throw new common_1.NotFoundException(`Blog with ID ${id} not found.`);
        }
        const isPublishing = blog.status !== blog_schema_1.BlogStatus.VISIBLE && status === blog_schema_1.BlogStatus.VISIBLE;
        blog.status = status;
        blog.updatedBy = new mongoose_1.Types.ObjectId(userId);
        const updatedBlog = await blog.save();
        if (isPublishing) {
            const subscribers = await this.subscribersService.findAll();
        }
        return updatedBlog;
    }
};
BlogsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(blog_schema_1.Blog.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_1.Model !== "undefined" && mongoose_1.Model) === "function" ? _a : Object, typeof (_b = typeof mail_service_1.MailService !== "undefined" && mail_service_1.MailService) === "function" ? _b : Object, typeof (_c = typeof subscribers_service_1.SubscribersService !== "undefined" && subscribers_service_1.SubscribersService) === "function" ? _c : Object])
], BlogsService);
exports.BlogsService = BlogsService;


/***/ }),

/***/ "./src/modules/blogs/schemas/blog.schema.ts":
/*!**************************************************!*\
  !*** ./src/modules/blogs/schemas/blog.schema.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BlogSchema = exports.Blog = exports.BlogStatus = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const mongoose = __importStar(__webpack_require__(/*! mongoose */ "mongoose"));
var BlogStatus;
(function (BlogStatus) {
    BlogStatus["VISIBLE"] = "visible";
    BlogStatus["HIDDEN"] = "hidden";
    BlogStatus["DRAFT"] = "draft";
    BlogStatus["ARCHIVED"] = "archived";
})(BlogStatus = exports.BlogStatus || (exports.BlogStatus = {}));
let Blog = class Blog extends mongoose_2.Document {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Blog.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Blog.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Blog.prototype, "excerpt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Blog.prototype, "content", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Blog.prototype, "coverImage", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Blog.prototype, "tags", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: BlogStatus, default: BlogStatus.DRAFT }),
    __metadata("design:type", String)
], Blog.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }] }),
    __metadata("design:type", Array)
], Blog.prototype, "categories", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Blog.prototype, "seoTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Blog.prototype, "seoDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Blog.prototype, "seoKeywords", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Blog.prototype, "seoCanonicalUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Blog.prototype, "seoOgImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: "User" }),
    __metadata("design:type", Object)
], Blog.prototype, "author", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: "User" }),
    __metadata("design:type", Object)
], Blog.prototype, "updatedBy", void 0);
Blog = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Blog);
exports.Blog = Blog;
exports.BlogSchema = mongoose_1.SchemaFactory.createForClass(Blog);
exports.BlogSchema.index({
    title: "text",
    excerpt: "text",
    content: "text",
    tags: "text",
    seoKeywords: "text",
});


/***/ }),

/***/ "./src/modules/bookings/bookings.controller.ts":
/*!*****************************************************!*\
  !*** ./src/modules/bookings/bookings.controller.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookingsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const express_1 = __webpack_require__(/*! express */ "express");
const bookings_service_1 = __webpack_require__(/*! ./bookings.service */ "./src/modules/bookings/bookings.service.ts");
const roles_guard_1 = __webpack_require__(/*! ../auth/guards/roles.guard */ "./src/modules/auth/guards/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./src/modules/auth/decorators/roles.decorator.ts");
const user_schema_1 = __webpack_require__(/*! ../users/schemas/user.schema */ "./src/modules/users/schemas/user.schema.ts");
const booking_schema_1 = __webpack_require__(/*! ./schemas/booking.schema */ "./src/modules/bookings/schemas/booking.schema.ts");
const tours_service_1 = __webpack_require__(/*! ../tours/tours.service */ "./src/modules/tours/tours.service.ts");
const users_service_1 = __webpack_require__(/*! ../users/users.service */ "./src/modules/users/users.service.ts");
const session_auth_guard_1 = __webpack_require__(/*! ../auth/guards/session-auth.guard */ "./src/modules/auth/guards/session-auth.guard.ts");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
let BookingsController = class BookingsController {
    constructor(bookingsService, toursService, usersService) {
        this.bookingsService = bookingsService;
        this.toursService = toursService;
        this.usersService = usersService;
    }
    async createBooking(createBookingDto, res, req) {
        let redirectUrl = "/";
        try {
            if (createBookingDto.tour && mongoose_1.Types.ObjectId.isValid(createBookingDto.tour.toString())) {
                try {
                    const tour = await this.toursService.findOne(createBookingDto.tour.toString());
                    if (tour && tour.slug) {
                        redirectUrl = `/tours/${tour.slug}`;
                    }
                }
                catch (slugError) {
                    console.warn("Could not find tour slug for redirection:", slugError.message);
                }
            }
            if (!createBookingDto.tour || !mongoose_1.Types.ObjectId.isValid(createBookingDto.tour.toString())) {
                console.log("Tour ID validation failed or tour is missing.");
                req.flash("error_msg", "Invalid tour selected for booking.");
                return res.redirect(redirectUrl);
            }
            await this.bookingsService.create(createBookingDto);
            req.flash("success_msg", "Your booking inquiry has been received! We'll be in touch soon.");
            return res.redirect(redirectUrl);
        }
        catch (error) {
            console.error("Error creating booking in controller:", error);
            req.flash("error_msg", "Failed to submit your booking. Please try again or contact us directly.");
            return res.redirect(redirectUrl);
        }
    }
    async getBookings(query, req) {
        const filter = Object.assign({}, query);
        if (req.user.role === user_schema_1.UserRole.AGENT) {
            filter.assignedTo = req.user.id;
        }
        const bookings = await this.bookingsService.findAll(filter);
        const tours = await this.toursService.findAll();
        return {
            title: "Bookings - Dashboard",
            bookings,
            tours,
            user: req.user,
            query,
            layout: "layouts/dashboard",
        };
    }
    async getBooking(id, req, res) {
        var _a;
        const booking = await this.bookingsService.findOne(id);
        if (req.user.role === user_schema_1.UserRole.AGENT && ((_a = booking.assignedTo) === null || _a === void 0 ? void 0 : _a.toString()) !== req.user.id) {
            req.flash("error_msg", "You are not authorized to view this booking");
            return res.redirect("/bookings/dashboard");
        }
        let agents = [];
        if (req.user.role === user_schema_1.UserRole.ADMIN) {
            agents = await this.usersService.findAllAgents();
        }
        return {
            title: "View Booking - Dashboard",
            booking,
            agents,
            user: req.user,
            layout: "layouts/dashboard",
        };
    }
    async updateBooking(id, updateBookingDto, req, res) {
        var _a;
        try {
            const booking = await this.bookingsService.findOne(id);
            if (req.user.role === user_schema_1.UserRole.AGENT && ((_a = booking.assignedTo) === null || _a === void 0 ? void 0 : _a.toString()) !== req.user.id) {
                req.flash("error_msg", "You are not authorized to update this booking");
                return res.redirect("/bookings/dashboard");
            }
            await this.bookingsService.update(id, updateBookingDto, req.user.id);
            req.flash("success_msg", "Booking updated successfully");
            return res.redirect("/bookings/dashboard");
        }
        catch (error) {
            req.flash("error_msg", error.message);
            return res.redirect(`/bookings/dashboard/view/${id}`);
        }
    }
    async updateBookingStatus(id, status, req, res) {
        var _a;
        try {
            const booking = await this.bookingsService.findOne(id);
            if (req.user.role === user_schema_1.UserRole.AGENT && ((_a = booking.assignedTo) === null || _a === void 0 ? void 0 : _a.toString()) !== req.user.id) {
                req.flash("error_msg", "You are not authorized to update this booking");
                return res.redirect("/bookings/dashboard");
            }
            await this.bookingsService.updateStatus(id, status, req.user.id);
            req.flash("success_msg", `Booking status updated to ${status}`);
            return res.redirect("/bookings/dashboard");
        }
        catch (error) {
            req.flash("error_msg", error.message);
            return res.redirect("/bookings/dashboard");
        }
    }
    async assignBookingToAgent(id, agentId, req, res) {
        try {
            await this.bookingsService.assignToAgent(id, agentId, req.user.id);
            req.flash("success_msg", "Booking assigned to agent successfully");
            return res.redirect("/bookings/dashboard");
        }
        catch (error) {
            req.flash("error_msg", error.message);
            return res.redirect("/bookings/dashboard");
        }
    }
    async deleteBooking(id, req, res) {
        try {
            await this.bookingsService.remove(id);
            req.flash("success_msg", "Booking deleted successfully");
            return res.redirect("/bookings/dashboard");
        }
        catch (error) {
            req.flash("error_msg", error.message);
            return res.redirect("/bookings/dashboard");
        }
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_d = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _d : Object, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "createBooking", null);
__decorate([
    (0, common_1.Get)("dashboard"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard),
    (0, common_1.Render)("dashboard/bookings/index"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "getBookings", null);
__decorate([
    (0, common_1.Get)("dashboard/view/:id"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard),
    (0, common_1.Render)("dashboard/bookings/view"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_e = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "getBooking", null);
__decorate([
    (0, common_1.Post)("dashboard/update/:id"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, typeof (_f = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "updateBooking", null);
__decorate([
    (0, common_1.Get)("dashboard/status/:id/:status"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Param)("status")),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_g = typeof booking_schema_1.BookingStatus !== "undefined" && booking_schema_1.BookingStatus) === "function" ? _g : Object, Object, typeof (_h = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "updateBookingStatus", null);
__decorate([
    (0, common_1.Get)("dashboard/assign/:id/:agentId"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Param)("agentId")),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, typeof (_j = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _j : Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "assignBookingToAgent", null);
__decorate([
    (0, common_1.Get)("dashboard/delete/:id"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_k = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _k : Object]),
    __metadata("design:returntype", Promise)
], BookingsController.prototype, "deleteBooking", null);
BookingsController = __decorate([
    (0, common_1.Controller)("bookings"),
    __metadata("design:paramtypes", [typeof (_a = typeof bookings_service_1.BookingsService !== "undefined" && bookings_service_1.BookingsService) === "function" ? _a : Object, typeof (_b = typeof tours_service_1.ToursService !== "undefined" && tours_service_1.ToursService) === "function" ? _b : Object, typeof (_c = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _c : Object])
], BookingsController);
exports.BookingsController = BookingsController;


/***/ }),

/***/ "./src/modules/bookings/bookings.module.ts":
/*!*************************************************!*\
  !*** ./src/modules/bookings/bookings.module.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookingsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const bookings_service_1 = __webpack_require__(/*! ./bookings.service */ "./src/modules/bookings/bookings.service.ts");
const bookings_controller_1 = __webpack_require__(/*! ./bookings.controller */ "./src/modules/bookings/bookings.controller.ts");
const booking_schema_1 = __webpack_require__(/*! ./schemas/booking.schema */ "./src/modules/bookings/schemas/booking.schema.ts");
const mail_module_1 = __webpack_require__(/*! ../mail/mail.module */ "./src/modules/mail/mail.module.ts");
const tours_module_1 = __webpack_require__(/*! ../tours/tours.module */ "./src/modules/tours/tours.module.ts");
const users_module_1 = __webpack_require__(/*! ../users/users.module */ "./src/modules/users/users.module.ts");
let BookingsModule = class BookingsModule {
};
BookingsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: booking_schema_1.Booking.name, schema: booking_schema_1.BookingSchema }]),
            mail_module_1.MailModule,
            tours_module_1.ToursModule,
            users_module_1.UsersModule,
        ],
        controllers: [bookings_controller_1.BookingsController],
        providers: [bookings_service_1.BookingsService],
        exports: [bookings_service_1.BookingsService],
    })
], BookingsModule);
exports.BookingsModule = BookingsModule;


/***/ }),

/***/ "./src/modules/bookings/bookings.service.ts":
/*!**************************************************!*\
  !*** ./src/modules/bookings/bookings.service.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookingsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const booking_schema_1 = __webpack_require__(/*! ./schemas/booking.schema */ "./src/modules/bookings/schemas/booking.schema.ts");
const mail_service_1 = __webpack_require__(/*! ../mail/mail.service */ "./src/modules/mail/mail.service.ts");
let BookingsService = class BookingsService {
    constructor(bookingModel, mailService) {
        this.bookingModel = bookingModel;
        this.mailService = mailService;
    }
    async create(createBookingDto) {
        const newBooking = new this.bookingModel(createBookingDto);
        const savedBooking = await newBooking.save();
        await this.mailService.sendBookingNotification(savedBooking);
        await this.mailService.sendBookingConfirmation(savedBooking);
        return savedBooking;
    }
    async findAll(query) {
        const filter = {};
        if (query && query.search) {
            filter.$text = { $search: query.search };
        }
        if (query && query.status) {
            filter.status = query.status;
        }
        if (query && query.tour) {
            filter.tour = query.tour;
        }
        if (query && query.assignedTo) {
            filter.assignedTo = query.assignedTo;
        }
        return this.bookingModel
            .find(filter)
            .sort({ createdAt: -1 })
            .populate("tour", "title slug")
            .populate("assignedTo", "name email")
            .populate("updatedBy", "name email")
            .exec();
    }
    async findOne(id) {
        const booking = await this.bookingModel
            .findById(id)
            .populate("tour", "title slug")
            .populate("assignedTo", "name email")
            .populate("updatedBy", "name email")
            .exec();
        if (!booking) {
            throw new common_1.NotFoundException(`Booking with ID ${id} not found`);
        }
        return booking;
    }
    async update(id, updateBookingDto, userId) {
        const booking = await this.bookingModel.findById(id).exec();
        if (!booking) {
            throw new common_1.NotFoundException(`Booking with ID ${id} not found`);
        }
        const isStatusChanging = updateBookingDto.status && updateBookingDto.status !== booking.status;
        if (userId) {
            updateBookingDto.updatedBy = userId;
        }
        const updatedBooking = await this.bookingModel.findByIdAndUpdate(id, updateBookingDto, { new: true }).exec();
        if (isStatusChanging) {
            await this.mailService.sendBookingStatusUpdate(updatedBooking);
        }
        return updatedBooking;
    }
    async remove(id) {
        const deletedBooking = await this.bookingModel.findByIdAndDelete(id).exec();
        if (!deletedBooking) {
            throw new common_1.NotFoundException(`Booking with ID ${id} not found`);
        }
        return deletedBooking;
    }
    async updateStatus(id, status, userId) {
        const booking = await this.bookingModel.findById(id).exec();
        if (!booking) {
            throw new common_1.NotFoundException(`Booking with ID ${id} not found`);
        }
        booking.status = status;
        booking.updatedBy = new mongoose_2.Types.ObjectId(userId);
        const updatedBooking = await booking.save();
        await this.mailService.sendBookingStatusUpdate(updatedBooking);
        return updatedBooking;
    }
    async assignToAgent(id, agentId, userId) {
        const booking = await this.bookingModel.findById(id).exec();
        if (!booking) {
            throw new common_1.NotFoundException(`Booking with ID ${id} not found`);
        }
        booking.assignedTo = new mongoose_2.Types.ObjectId(userId);
        booking.updatedBy = new mongoose_2.Types.ObjectId(userId);
        return booking.save();
    }
};
BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object, typeof (_b = typeof mail_service_1.MailService !== "undefined" && mail_service_1.MailService) === "function" ? _b : Object])
], BookingsService);
exports.BookingsService = BookingsService;


/***/ }),

/***/ "./src/modules/bookings/schemas/booking.schema.ts":
/*!********************************************************!*\
  !*** ./src/modules/bookings/schemas/booking.schema.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BookingSchema = exports.Booking = exports.BookingStatus = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const mongoose = __importStar(__webpack_require__(/*! mongoose */ "mongoose"));
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "pending";
    BookingStatus["CONFIRMED"] = "confirmed";
    BookingStatus["CANCELLED"] = "cancelled";
    BookingStatus["COMPLETED"] = "completed";
})(BookingStatus = exports.BookingStatus || (exports.BookingStatus = {}));
let Booking = class Booking extends mongoose_2.Document {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Booking.prototype, "fullName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Booking.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Booking.prototype, "phoneNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Booking.prototype, "country", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: "Tour" }),
    __metadata("design:type", Object)
], Booking.prototype, "tour", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Booking.prototype, "customTourRequest", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Booking.prototype, "travelDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Booking.prototype, "numberOfAdults", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Booking.prototype, "numberOfChildren", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Booking.prototype, "specialRequirements", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: BookingStatus, default: BookingStatus.PENDING }),
    __metadata("design:type", String)
], Booking.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Booking.prototype, "adminNotes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: "User" }),
    __metadata("design:type", Object)
], Booking.prototype, "assignedTo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: "User" }),
    __metadata("design:type", Object)
], Booking.prototype, "updatedBy", void 0);
Booking = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Booking);
exports.Booking = Booking;
exports.BookingSchema = mongoose_1.SchemaFactory.createForClass(Booking);
exports.BookingSchema.index({
    fullName: "text",
    email: "text",
    phoneNumber: "text",
    country: "text",
    customTourRequest: "text",
    specialRequirements: "text",
    adminNotes: "text",
});


/***/ }),

/***/ "./src/modules/categories/categories-public.controller.ts":
/*!****************************************************************!*\
  !*** ./src/modules/categories/categories-public.controller.ts ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoriesPublicController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const express_1 = __webpack_require__(/*! express */ "express");
const categories_service_1 = __webpack_require__(/*! ./categories.service */ "./src/modules/categories/categories.service.ts");
const tours_service_1 = __webpack_require__(/*! ../tours/tours.service */ "./src/modules/tours/tours.service.ts");
let CategoriesPublicController = class CategoriesPublicController {
    constructor(categoriesService, toursService) {
        this.categoriesService = categoriesService;
        this.toursService = toursService;
    }
    async getCategory(slug, req, res) {
        try {
            const category = await this.categoriesService.findBySlug(slug);
            if (!category) {
                throw new common_1.HttpException('Category not found', common_1.HttpStatus.NOT_FOUND);
            }
            let tours = [];
            if (category.country) {
                tours = await this.toursService.findByCategory(category._id.toString(), category.country._id.toString());
            }
            else {
                tours = await this.toursService.findByCategory(category._id.toString());
            }
            return {
                title: `${category.name} Safaris - Roads of Adventure Safaris`,
                category,
                tours,
                layout: "layouts/public",
                messages: req.flash(),
                seo: {
                    title: category.seoTitle || `${category.name} Safaris - Roads of Adventure Safaris`,
                    description: category.seoDescription || category.description,
                    keywords: category.seoKeywords,
                    canonicalUrl: `YOUR_BASE_URL/categories/${category.slug}`,
                    ogImage: category.image,
                },
            };
        }
        catch (error) {
            console.error(`Error loading category page for slug ${slug}:`, error);
            req.flash('error_msg', error.message || 'Category not found or an error occurred.');
            return res.redirect('/');
        }
    }
};
__decorate([
    (0, common_1.Get)(":slug"),
    (0, common_1.Render)("public/categories/show"),
    __param(0, (0, common_1.Param)("slug")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_c = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], CategoriesPublicController.prototype, "getCategory", null);
CategoriesPublicController = __decorate([
    (0, common_1.Controller)('categories'),
    __metadata("design:paramtypes", [typeof (_a = typeof categories_service_1.CategoriesService !== "undefined" && categories_service_1.CategoriesService) === "function" ? _a : Object, typeof (_b = typeof tours_service_1.ToursService !== "undefined" && tours_service_1.ToursService) === "function" ? _b : Object])
], CategoriesPublicController);
exports.CategoriesPublicController = CategoriesPublicController;


/***/ }),

/***/ "./src/modules/categories/categories.api.controller.ts":
/*!*************************************************************!*\
  !*** ./src/modules/categories/categories.api.controller.ts ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoriesApiController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const categories_service_1 = __webpack_require__(/*! ./categories.service */ "./src/modules/categories/categories.service.ts");
const session_auth_guard_1 = __webpack_require__(/*! ../auth/guards/session-auth.guard */ "./src/modules/auth/guards/session-auth.guard.ts");
let CategoriesApiController = class CategoriesApiController {
    constructor(categoriesService) {
        this.categoriesService = categoriesService;
    }
    async getAllCategoriesApi(page = "1", limit = "10", search, countryId = "all") {
        const categoriesResult = await this.categoriesService.findAll({ page, limit, search, countryId });
        return categoriesResult;
    }
    async getCategoriesByCountry(countryId) {
        const categories = await this.categoriesService.findByCountry(countryId);
        return { data: categories };
    }
};
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Query)("search")),
    __param(3, (0, common_1.Query)("countryId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], CategoriesApiController.prototype, "getAllCategoriesApi", null);
__decorate([
    (0, common_1.Get)('by-country/:countryId'),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard),
    __param(0, (0, common_1.Param)('countryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoriesApiController.prototype, "getCategoriesByCountry", null);
CategoriesApiController = __decorate([
    (0, common_1.Controller)("api/categories"),
    __metadata("design:paramtypes", [typeof (_a = typeof categories_service_1.CategoriesService !== "undefined" && categories_service_1.CategoriesService) === "function" ? _a : Object])
], CategoriesApiController);
exports.CategoriesApiController = CategoriesApiController;


/***/ }),

/***/ "./src/modules/categories/categories.controller.ts":
/*!*********************************************************!*\
  !*** ./src/modules/categories/categories.controller.ts ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoriesController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const platform_express_1 = __webpack_require__(/*! @nestjs/platform-express */ "@nestjs/platform-express");
const express_1 = __webpack_require__(/*! express */ "express");
const categories_service_1 = __webpack_require__(/*! ./categories.service */ "./src/modules/categories/categories.service.ts");
const create_category_dto_1 = __webpack_require__(/*! ./dto/create-category.dto */ "./src/modules/categories/dto/create-category.dto.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./src/modules/auth/decorators/roles.decorator.ts");
const user_schema_1 = __webpack_require__(/*! ../users/schemas/user.schema */ "./src/modules/users/schemas/user.schema.ts");
const session_auth_guard_1 = __webpack_require__(/*! ../auth/guards/session-auth.guard */ "./src/modules/auth/guards/session-auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../auth/guards/roles.guard */ "./src/modules/auth/guards/roles.guard.ts");
const update_category_dto_1 = __webpack_require__(/*! ./dto/update-category.dto */ "./src/modules/categories/dto/update-category.dto.ts");
const countries_service_1 = __webpack_require__(/*! ../countries/countries.service */ "./src/modules/countries/countries.service.ts");
const multer_1 = __webpack_require__(/*! multer */ "multer");
const path_1 = __webpack_require__(/*! path */ "path");
let CategoriesController = class CategoriesController {
    constructor(categoriesService, countriesService) {
        this.categoriesService = categoriesService;
        this.countriesService = countriesService;
    }
    async getCategories(req, page = '1', limit = '10', search, countryId = "all") {
        const currentPage = parseInt(page, 10);
        const perPageLimit = parseInt(limit, 10);
        const findCategoriesOptions = { page: currentPage.toString(), limit: perPageLimit.toString() };
        if (search)
            findCategoriesOptions.search = search;
        if (countryId && countryId !== "all")
            findCategoriesOptions.countryId = countryId;
        const { data: categories, total: totalDocs, limit: resLimit, totalPages, page: resPage, } = await this.categoriesService.findAll(findCategoriesOptions);
        const hasNextPage = resPage < totalPages;
        const hasPrevPage = resPage > 1;
        const nextPage = hasNextPage ? resPage + 1 : null;
        const prevPage = hasPrevPage ? resPage - 1 : null;
        const allCountriesResult = await this.countriesService.findAll({});
        const countries = allCountriesResult.data;
        return {
            title: 'Categories - Dashboard',
            categories,
            countries,
            user: req.user,
            query: { page: currentPage.toString(), limit: perPageLimit.toString(), search, countryId },
            pagination: {
                totalDocs,
                limit: resLimit,
                totalPages,
                page: resPage,
                hasNextPage,
                hasPrevPage,
                nextPage,
                prevPage,
            },
            messages: req.flash(),
            layout: 'layouts/dashboard',
        };
    }
    async getAddCategoryPage(req) {
        const allCountriesResult = await this.countriesService.findAll({});
        const countries = allCountriesResult.data;
        const body = {};
        return {
            title: 'Add Category - Dashboard',
            layout: 'layouts/dashboard',
            countries,
            user: req.user,
            messages: req.flash(),
            body,
        };
    }
    async addCategory(createCategoryDto, file, req, res) {
        if (!req.user || !req.user.id) {
            req.flash('error_msg', 'You must be logged in to add a category.');
            return res.redirect('/auth/login');
        }
        try {
            if (file) {
                createCategoryDto.image = `/uploads/categories/${file.filename}`;
            }
            else {
                delete createCategoryDto.image;
            }
            const userId = req.user.id.toString();
            const newCategory = await this.categoriesService.create(createCategoryDto, userId);
            req.flash('success_msg', 'Category added successfully!');
            return res.redirect('/categories/dashboard');
        }
        catch (error) {
            req.flash('error_msg', error.message || 'Failed to add category.');
            const allCountriesResult = await this.countriesService.findAll({});
            const countries = allCountriesResult.data;
            return res.render('dashboard/categories/add', {
                title: 'Add Category - Dashboard',
                countries,
                user: req.user,
                layout: 'layouts/dashboard',
                messages: req.flash(),
                oldInput: createCategoryDto,
            });
        }
    }
    async getEditCategoryPage(id, req, res) {
        try {
            const category = await this.categoriesService.findOne(id);
            const allCountriesResult = await this.countriesService.findAll({});
            const countries = allCountriesResult.data;
            const user = req.user;
            if (user.role === user_schema_1.UserRole.AGENT && category.createdBy.toString() !== user._id.toString()) {
                req.flash('error', 'You are not authorized to edit this category.');
                return res.redirect('/dashboard/categories');
            }
            return {
                title: 'Edit Category - Dashboard',
                category,
                countries,
                user: req.user,
                layout: 'layouts/dashboard',
                messages: req.flash(),
            };
        }
        catch (error) {
            console.error('Error fetching category for edit:', error);
            req.flash('error', error.message || 'Category not found or an error occurred.');
            return res.redirect('/dashboard/categories');
        }
    }
    async updateCategory(id, updateCategoryDto, file, req, res) {
        if (!req.user || !req.user.id) {
            req.flash('error_msg', 'You must be logged in to update a category.');
            return res.redirect('/auth/login');
        }
        try {
            if (file) {
                updateCategoryDto.image = `/uploads/categories/${file.filename}`;
            }
            else if (updateCategoryDto.image === '') {
                updateCategoryDto.image = null;
            }
            const userId = req.user.id.toString();
            const updatedCategory = await this.categoriesService.update(id, updateCategoryDto, userId);
            req.flash('success_msg', 'Category updated successfully!');
            return res.redirect('/categories/dashboard');
        }
        catch (error) {
            req.flash('error_msg', error.message || 'Failed to update category.');
            const allCountriesResult = await this.countriesService.findAll({});
            const countries = allCountriesResult.data;
            return res.render('dashboard/categories/edit', {
                title: 'Edit Category - Dashboard',
                category: Object.assign({ _id: id }, updateCategoryDto),
                countries,
                user: req.user,
                layout: 'layouts/dashboard',
                messages: req.flash(),
                oldInput: updateCategoryDto,
            });
        }
    }
    async deleteCategory(id, req, res) {
        try {
            const user = req.user;
            const existingCategory = await this.categoriesService.findOne(id);
            if (user.role === user_schema_1.UserRole.AGENT && existingCategory.createdBy.toString() !== user._id.toString()) {
                req.flash('error_msg', 'You are not authorized to delete this category.');
                return res.status(403).json({ success: false, message: 'Unauthorized' });
            }
            await this.categoriesService.remove(id);
            req.flash('success_msg', 'Category deleted successfully!');
            return res.redirect('/categories/dashboard');
        }
        catch (error) {
            console.error('Error deleting category:', error);
            req.flash('error_msg', error.message || 'Failed to delete category.');
            return res.status(500).json({ success: false, message: error.message || 'Failed to delete category' });
        }
    }
};
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, common_1.Render)('dashboard/categories/index'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __param(3, (0, common_1.Query)('search')),
    __param(4, (0, common_1.Query)('countryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)('dashboard/add'),
    (0, common_1.Render)('dashboard/categories/add'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "getAddCategoryPage", null);
__decorate([
    (0, common_1.Post)('dashboard/add'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        storage: (0, multer_1.diskStorage)({
            destination: './public/uploads/categories',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = (0, path_1.extname)(file.originalname);
                callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            },
        }),
        fileFilter: (req, file, callback) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return callback(new Error('Only image files are allowed!'), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 1024 * 1024 * 5
        }
    })),
    __param(0, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof create_category_dto_1.CreateCategoryDto !== "undefined" && create_category_dto_1.CreateCategoryDto) === "function" ? _c : Object, typeof (_e = typeof Express !== "undefined" && (_d = Express.Multer) !== void 0 && _d.File) === "function" ? _e : Object, Object, typeof (_f = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "addCategory", null);
__decorate([
    (0, common_1.Get)('dashboard/edit/:id'),
    (0, common_1.Render)('dashboard/categories/edit'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_g = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _g : Object]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "getEditCategoryPage", null);
__decorate([
    (0, common_1.Put)('dashboard/edit/:id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {})),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)(common_1.ValidationPipe)),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, common_1.Req)()),
    __param(4, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_h = typeof update_category_dto_1.UpdateCategoryDto !== "undefined" && update_category_dto_1.UpdateCategoryDto) === "function" ? _h : Object, typeof (_k = typeof Express !== "undefined" && (_j = Express.Multer) !== void 0 && _j.File) === "function" ? _k : Object, Object, typeof (_l = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _l : Object]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Delete)('dashboard/delete/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_m = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _m : Object]),
    __metadata("design:returntype", Promise)
], CategoriesController.prototype, "deleteCategory", null);
CategoriesController = __decorate([
    (0, common_1.Controller)('categories'),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.AGENT),
    __metadata("design:paramtypes", [typeof (_a = typeof categories_service_1.CategoriesService !== "undefined" && categories_service_1.CategoriesService) === "function" ? _a : Object, typeof (_b = typeof countries_service_1.CountriesService !== "undefined" && countries_service_1.CountriesService) === "function" ? _b : Object])
], CategoriesController);
exports.CategoriesController = CategoriesController;


/***/ }),

/***/ "./src/modules/categories/categories.module.ts":
/*!*****************************************************!*\
  !*** ./src/modules/categories/categories.module.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoriesModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const categories_service_1 = __webpack_require__(/*! ./categories.service */ "./src/modules/categories/categories.service.ts");
const categories_controller_1 = __webpack_require__(/*! ./categories.controller */ "./src/modules/categories/categories.controller.ts");
const category_schema_1 = __webpack_require__(/*! ./schemas/category.schema */ "./src/modules/categories/schemas/category.schema.ts");
const countries_module_1 = __webpack_require__(/*! ../countries/countries.module */ "./src/modules/countries/countries.module.ts");
const categories_api_controller_1 = __webpack_require__(/*! ./categories.api.controller */ "./src/modules/categories/categories.api.controller.ts");
const tours_module_1 = __webpack_require__(/*! ../tours/tours.module */ "./src/modules/tours/tours.module.ts");
const categories_public_controller_1 = __webpack_require__(/*! ./categories-public.controller */ "./src/modules/categories/categories-public.controller.ts");
let CategoriesModule = class CategoriesModule {
};
CategoriesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: category_schema_1.Category.name, schema: category_schema_1.CategorySchema }]),
            (0, common_1.forwardRef)(() => countries_module_1.CountriesModule),
            (0, common_1.forwardRef)(() => tours_module_1.ToursModule),
        ],
        controllers: [categories_controller_1.CategoriesController, categories_api_controller_1.CategoriesApiController, categories_public_controller_1.CategoriesPublicController],
        providers: [categories_service_1.CategoriesService],
        exports: [categories_service_1.CategoriesService],
    })
], CategoriesModule);
exports.CategoriesModule = CategoriesModule;


/***/ }),

/***/ "./src/modules/categories/categories.service.ts":
/*!******************************************************!*\
  !*** ./src/modules/categories/categories.service.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategoriesService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const category_schema_1 = __webpack_require__(/*! ./schemas/category.schema */ "./src/modules/categories/schemas/category.schema.ts");
const slugify_1 = __importDefault(__webpack_require__(/*! slugify */ "slugify"));
let CategoriesService = class CategoriesService {
    constructor(categoryModel) {
        this.categoryModel = categoryModel;
    }
    generateSlug(text) {
        return (0, slugify_1.default)(text, { lower: true, strict: true });
    }
    async create(createCategoryDto, userId) {
        if (!createCategoryDto.slug) {
            createCategoryDto.slug = this.generateSlug(createCategoryDto.name);
        }
        const existingCategory = await this.categoryModel.findOne({
            $or: [{ name: createCategoryDto.name }, { slug: createCategoryDto.slug }],
        });
        if (existingCategory) {
            throw new common_1.ConflictException("Category with this name or slug already exists.");
        }
        const newCategory = new this.categoryModel(Object.assign(Object.assign({}, createCategoryDto), { createdBy: userId, updatedBy: userId }));
        return newCategory.save();
    }
    async findAll(query = {}) {
        const { search, page = '1', limit = '6', countryId } = query;
        const parsedPage = parseInt(page, 10);
        const parsedLimit = parseInt(limit, 10);
        const skip = (parsedPage - 1) * parsedLimit;
        const filter = {};
        if (search) {
            filter.$text = { $search: search };
        }
        if (countryId && countryId !== "all") {
            filter.country = countryId;
        }
        const [categories, total] = await Promise.all([
            this.categoryModel
                .find(filter)
                .sort({ createdAt: 1 })
                .skip(skip)
                .limit(parsedLimit)
                .populate("createdBy", "name email")
                .exec(),
            this.categoryModel.countDocuments(filter).exec(),
        ]);
        const totalPages = Math.ceil(total / parsedLimit);
        return {
            data: categories,
            total,
            page: parsedPage,
            limit: parsedLimit,
            totalPages,
        };
    }
    async findOne(id) {
        const category = await this.categoryModel.findById(id).populate("createdBy", "name email").exec();
        if (!category) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found.`);
        }
        return category;
    }
    async findBySlug(slug) {
        return this.categoryModel
            .findOne({ slug })
            .sort({ time: 1 })
            .populate('country', 'name slug code')
            .exec();
    }
    async update(id, updateCategoryDto, userId) {
        if (updateCategoryDto.name && !updateCategoryDto.slug) {
            updateCategoryDto.slug = this.generateSlug(updateCategoryDto.name);
        }
        if (updateCategoryDto.slug) {
            const existingCategory = await this.categoryModel.findOne({
                slug: updateCategoryDto.slug,
                _id: { $ne: id },
            });
            if (existingCategory) {
                throw new common_1.ConflictException("Category with this slug already exists.");
            }
        }
        const updatedCategory = await this.categoryModel
            .findByIdAndUpdate(id, Object.assign(Object.assign({}, updateCategoryDto), { updatedBy: userId }), { new: true })
            .exec();
        if (!updatedCategory) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found.`);
        }
        return updatedCategory;
    }
    async remove(id) {
        const deletedCategory = await this.categoryModel.findByIdAndDelete(id).exec();
        if (!deletedCategory) {
            throw new common_1.NotFoundException(`Category with ID ${id} not found.`);
        }
        return deletedCategory;
    }
    async findByCountry(countryId) {
        if (!mongoose_2.Types.ObjectId.isValid(countryId)) {
            throw new common_1.NotFoundException(`Invalid country ID format: ${countryId}`);
        }
        try {
            const categories = await this.categoryModel
                .find({ country: new mongoose_2.Types.ObjectId(countryId) })
                .populate('country', 'name slug')
                .select('name slug image')
                .sort({ name: 1 })
                .exec();
            return categories;
        }
        catch (error) {
            console.error(`[CategoriesService] Error retrieving categories for country ID ${countryId}:`, error);
            throw new common_1.NotFoundException(`Could not retrieve categories for country ID: ${countryId}`);
        }
    }
};
CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(category_schema_1.Category.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], CategoriesService);
exports.CategoriesService = CategoriesService;


/***/ }),

/***/ "./src/modules/categories/dto/create-category.dto.ts":
/*!***********************************************************!*\
  !*** ./src/modules/categories/dto/create-category.dto.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateCategoryDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");
class CreateCategoryDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "slug", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "image", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => (value === '' ? null : value)),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsMongoId)(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "seoTitle", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "seoDescription", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCategoryDto.prototype, "seoKeywords", void 0);
exports.CreateCategoryDto = CreateCategoryDto;


/***/ }),

/***/ "./src/modules/categories/dto/update-category.dto.ts":
/*!***********************************************************!*\
  !*** ./src/modules/categories/dto/update-category.dto.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateCategoryDto = void 0;
const mapped_types_1 = __webpack_require__(/*! @nestjs/mapped-types */ "@nestjs/mapped-types");
const create_category_dto_1 = __webpack_require__(/*! ./create-category.dto */ "./src/modules/categories/dto/create-category.dto.ts");
class UpdateCategoryDto extends (0, mapped_types_1.PartialType)(create_category_dto_1.CreateCategoryDto) {
}
exports.UpdateCategoryDto = UpdateCategoryDto;


/***/ }),

/***/ "./src/modules/categories/schemas/category.schema.ts":
/*!***********************************************************!*\
  !*** ./src/modules/categories/schemas/category.schema.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CategorySchema = exports.Category = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const mongoose = __importStar(__webpack_require__(/*! mongoose */ "mongoose"));
const mongoose_paginate_v2_1 = __importDefault(__webpack_require__(/*! mongoose-paginate-v2 */ "mongoose-paginate-v2"));
let Category = class Category extends mongoose_2.Document {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Category.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Category.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Category.prototype, "image", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: "Country", required: false }),
    __metadata("design:type", Object)
], Category.prototype, "country", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Category.prototype, "seoTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Category.prototype, "seoDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Category.prototype, "seoKeywords", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: "User" }),
    __metadata("design:type", Object)
], Category.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: "User" }),
    __metadata("design:type", Object)
], Category.prototype, "updatedBy", void 0);
Category = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Category);
exports.Category = Category;
exports.CategorySchema = mongoose_1.SchemaFactory.createForClass(Category);
exports.CategorySchema.plugin(mongoose_paginate_v2_1.default);
exports.CategorySchema.index({ name: "text", description: "text" });


/***/ }),

/***/ "./src/modules/countries/countries.controller.ts":
/*!*******************************************************!*\
  !*** ./src/modules/countries/countries.controller.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CountriesController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const platform_express_1 = __webpack_require__(/*! @nestjs/platform-express */ "@nestjs/platform-express");
const express_1 = __webpack_require__(/*! express */ "express");
const countries_service_1 = __webpack_require__(/*! ./countries.service */ "./src/modules/countries/countries.service.ts");
const session_auth_guard_1 = __webpack_require__(/*! ../auth/guards/session-auth.guard */ "./src/modules/auth/guards/session-auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../auth/guards/roles.guard */ "./src/modules/auth/guards/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./src/modules/auth/decorators/roles.decorator.ts");
const user_schema_1 = __webpack_require__(/*! ../users/schemas/user.schema */ "./src/modules/users/schemas/user.schema.ts");
const multer_config_1 = __webpack_require__(/*! ../../config/multer.config */ "./src/config/multer.config.ts");
const tours_service_1 = __webpack_require__(/*! ../tours/tours.service */ "./src/modules/tours/tours.service.ts");
const categories_service_1 = __webpack_require__(/*! ../categories/categories.service */ "./src/modules/categories/categories.service.ts");
let CountriesController = class CountriesController {
    constructor(countriesService, categoriesService, toursService) {
        this.countriesService = countriesService;
        this.categoriesService = categoriesService;
        this.toursService = toursService;
    }
    async getAllCountries() {
        const countries = await this.countriesService.findAll();
        return {
            title: "Safari Destinations - Roads of Adventure Safaris",
            countries,
            layout: "layouts/public",
        };
    }
    async getCountry(slug, req, res) {
        try {
            const country = await this.countriesService.findBySlug(slug);
            const categories = await this.categoriesService.findByCountry(country._id.toString());
            const tours = await this.toursService.findByCountry(country._id.toString());
            return {
                title: `${country.name}`,
                country,
                categories,
                tours,
                layout: "layouts/public",
                messages: req.flash(),
                seo: {
                    title: country.seoTitle || `${country.name}`,
                    description: country.seoDescription || country.overview,
                    keywords: country.seoKeywords,
                    canonicalUrl: country.seoCanonicalUrl,
                    ogImage: country.seoOgImage || country.coverImage,
                },
            };
        }
        catch (error) {
            console.error(`Error loading country page for slug ${slug}:`, error);
            req.flash('error_msg', error.message || 'Country not found or an error occurred.');
            return res.redirect('/');
        }
    }
    async getCountries(query, req) {
        const page = parseInt(query.page || '1');
        const limit = parseInt(query.limit || '6');
        const search = query.search || '';
        const { data: countries, total, totalPages } = await this.countriesService.findAll({ search, page: page.toString(), limit: limit.toString() });
        return {
            title: "Countries - Dashboard",
            countries,
            user: req.user,
            query,
            currentPage: page,
            totalPages: totalPages,
            totalCountries: total,
            limit,
            layout: "layouts/dashboard",
            messages: req.flash(),
        };
    }
    getAddCountryPage(req) {
        return {
            title: "Add Country - Dashboard",
            user: req.user,
            layout: "layouts/dashboard",
        };
    }
    async addCountry(createCountryDto, uploadedFiles, req, res) {
        try {
            const newCoverImageFile = uploadedFiles.coverImage ? uploadedFiles.coverImage[0] : null;
            const newGalleryImageFiles = uploadedFiles.galleryImages || [];
            if (newCoverImageFile) {
                createCountryDto.coverImage = `/uploads/countries/${newCoverImageFile.filename}`;
            }
            else if (createCountryDto.coverImage === '') {
                createCountryDto.coverImage = null;
            }
            if (newGalleryImageFiles.length > 0) {
                createCountryDto.galleryImages = newGalleryImageFiles.map((file) => `/uploads/countries/${file.filename}`);
            }
            else if (!createCountryDto.galleryImages) {
                createCountryDto.galleryImages = [];
            }
            await this.countriesService.create(createCountryDto, req.user.id);
            req.flash("success_msg", "Country added successfully");
            return res.redirect("/countries/dashboard/countries");
        }
        catch (error) {
            console.error('Error adding country:', error);
            let flashMessage = "Failed to add country.";
            if (error instanceof common_1.HttpException) {
                const response = error.getResponse();
                if (typeof response === 'object' && response !== null && 'message' in response) {
                    if (Array.isArray(response.message)) {
                        flashMessage = response.message.join(', ');
                    }
                    else {
                        flashMessage = response.message;
                    }
                }
                else if (typeof response === 'string') {
                    flashMessage = response;
                }
                else {
                    flashMessage = error.message || "An unknown error occurred.";
                }
            }
            else if (error.message) {
                if (error.code === 11000 && error.keyPattern && error.keyValue) {
                    if (error.keyPattern.slug)
                        flashMessage = "A country with this slug already exists. Please choose a different title or slug.";
                    else if (error.keyPattern.title)
                        flashMessage = "A country with this title already exists.";
                    else
                        flashMessage = "A duplicate entry error occurred.";
                }
                else {
                    flashMessage = error.message;
                }
            }
            req.flash("error_msg", flashMessage);
            req.flash('oldInput', createCountryDto);
            return res.redirect("/countries/dashboard/countries/add");
        }
    }
    async getEditCountryPage(id, req) {
        try {
            const country = await this.countriesService.findOne(id);
            if (!country) {
                req.flash("error_msg", "Country not found.");
                return req.res.redirect("/countries/dashboard/countries");
            }
            return {
                title: `Edit ${country.name} - Dashboard`,
                country,
                user: req.user,
                layout: "layouts/dashboard",
                messages: req.flash(),
            };
        }
        catch (error) {
            console.error("Error fetching country for edit:", error);
            req.flash("error_msg", "Could not load country for editing.");
            return req.res.redirect("/countries/dashboard/countries");
        }
    }
    async updateCountry(id, updateCountryDto, uploadedFiles, req, res) {
        try {
            const country = await this.countriesService.findOne(id);
            if (!country) {
                req.flash("error_msg", "Country not found.");
                return res.redirect("/countries/dashboard/countries");
            }
            const newCoverImageFile = uploadedFiles.coverImage ? uploadedFiles.coverImage[0] : null;
            if (newCoverImageFile) {
                updateCountryDto.coverImage = `/uploads/countries/${newCoverImageFile.filename}`;
            }
            else if (updateCountryDto.coverImage === "remove") {
                updateCountryDto.coverImage = null;
            }
            const newGalleryImageFiles = uploadedFiles.galleryImages || [];
            let currentGalleryImages = country.galleryImages || [];
            const removedGalleryImagePaths = updateCountryDto.removedGalleryImages
                ? updateCountryDto.removedGalleryImages.split(',').map(img => img.trim()).filter(Boolean)
                : [];
            currentGalleryImages = currentGalleryImages.filter(img => !removedGalleryImagePaths.includes(img));
            if (newGalleryImageFiles.length > 0) {
                const newlyAddedGalleryPaths = newGalleryImageFiles.map((file) => `/uploads/countries/${file.filename}`);
                currentGalleryImages = [...currentGalleryImages, ...newlyAddedGalleryPaths];
            }
            updateCountryDto.galleryImages = currentGalleryImages;
            if (updateCountryDto.name && updateCountryDto.name !== country.name && !updateCountryDto.slug) {
                updateCountryDto.slug = this.countriesService.generateSlug(updateCountryDto.name);
            }
            else if (updateCountryDto.slug && updateCountryDto.slug !== country.slug) {
            }
            await this.countriesService.update(id, updateCountryDto, req.user._id);
            req.flash("success_msg", "Country updated successfully!");
            return res.redirect("/countries/dashboard/countries");
        }
        catch (error) {
            console.error('Error updating country:', error);
            let flashMessage = "Failed to update country. Please try again.";
            if (error instanceof common_1.HttpException) {
                const response = error.getResponse();
                if (typeof response === 'object' && response !== null && 'message' in response) {
                    if (Array.isArray(response.message)) {
                        flashMessage = response.message.join(', ');
                    }
                    else {
                        flashMessage = response.message;
                    }
                }
                else if (typeof response === 'string') {
                    flashMessage = response;
                }
                else {
                    flashMessage = error.message || "An unknown error occurred.";
                }
            }
            else if (error.message) {
                if (error.code === 11000 && error.keyPattern && error.keyValue) {
                    if (error.keyPattern.slug)
                        flashMessage = "A country with this slug already exists. Please choose a different title or slug.";
                    else if (error.keyPattern.name)
                        flashMessage = "A country with this name already exists.";
                    else
                        flashMessage = "A duplicate entry error occurred.";
                }
                else {
                    flashMessage = error.message;
                }
            }
            req.flash("error_msg", flashMessage);
            req.flash('oldInput', updateCountryDto);
            return res.redirect(`/countries/dashboard/countries/edit/${id}`);
        }
    }
    async deleteCountry(id, req, res) {
        try {
            await this.countriesService.remove(id);
            req.flash("success_msg", "Country deleted successfully");
            return res.redirect("/countries/dashboard/countries");
        }
        catch (error) {
            req.flash("error_msg", error.message);
            return res.redirect("/countries/dashboard/countries");
        }
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.Render)("public/countries/index"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CountriesController.prototype, "getAllCountries", null);
__decorate([
    (0, common_1.Get)(":slug"),
    (0, common_1.Render)("public/countries/show"),
    __param(0, (0, common_1.Param)("slug")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_d = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], CountriesController.prototype, "getCountry", null);
__decorate([
    (0, common_1.Get)("dashboard/countries"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, common_1.Render)("dashboard/countries/index"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CountriesController.prototype, "getCountries", null);
__decorate([
    (0, common_1.Get)("dashboard/countries/add"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, common_1.Render)("dashboard/countries/add"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CountriesController.prototype, "getAddCountryPage", null);
__decorate([
    (0, common_1.Post)("dashboard/countries/add"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'coverImage', maxCount: 1 },
        { name: 'galleryImages', maxCount: 10 },
    ], (0, multer_config_1.getMulterConfig)('countries'))),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, typeof (_e = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], CountriesController.prototype, "addCountry", null);
__decorate([
    (0, common_1.Get)("dashboard/countries/edit/:id"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, common_1.Render)("dashboard/countries/edit"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], CountriesController.prototype, "getEditCountryPage", null);
__decorate([
    (0, common_1.Post)("dashboard/countries/edit/:id"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'coverImage', maxCount: 1 },
        { name: 'galleryImages', maxCount: 10 },
    ], (0, multer_config_1.getMulterConfig)('countries'))),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __param(3, (0, common_1.Req)()),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, Object, typeof (_f = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], CountriesController.prototype, "updateCountry", null);
__decorate([
    (0, common_1.Get)("dashboard/countries/delete/:id"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_g = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _g : Object]),
    __metadata("design:returntype", Promise)
], CountriesController.prototype, "deleteCountry", null);
CountriesController = __decorate([
    (0, common_1.Controller)("countries"),
    __metadata("design:paramtypes", [typeof (_a = typeof countries_service_1.CountriesService !== "undefined" && countries_service_1.CountriesService) === "function" ? _a : Object, typeof (_b = typeof categories_service_1.CategoriesService !== "undefined" && categories_service_1.CategoriesService) === "function" ? _b : Object, typeof (_c = typeof tours_service_1.ToursService !== "undefined" && tours_service_1.ToursService) === "function" ? _c : Object])
], CountriesController);
exports.CountriesController = CountriesController;


/***/ }),

/***/ "./src/modules/countries/countries.module.ts":
/*!***************************************************!*\
  !*** ./src/modules/countries/countries.module.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CountriesModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const countries_service_1 = __webpack_require__(/*! ./countries.service */ "./src/modules/countries/countries.service.ts");
const countries_controller_1 = __webpack_require__(/*! ./countries.controller */ "./src/modules/countries/countries.controller.ts");
const country_schema_1 = __webpack_require__(/*! ./schemas/country.schema */ "./src/modules/countries/schemas/country.schema.ts");
const tours_module_1 = __webpack_require__(/*! ../tours/tours.module */ "./src/modules/tours/tours.module.ts");
const categories_module_1 = __webpack_require__(/*! ../categories/categories.module */ "./src/modules/categories/categories.module.ts");
let CountriesModule = class CountriesModule {
};
CountriesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: country_schema_1.Country.name, schema: country_schema_1.CountrySchema }]),
            tours_module_1.ToursModule,
            (0, common_1.forwardRef)(() => categories_module_1.CategoriesModule),
        ],
        controllers: [countries_controller_1.CountriesController],
        providers: [countries_service_1.CountriesService],
        exports: [countries_service_1.CountriesService],
    })
], CountriesModule);
exports.CountriesModule = CountriesModule;


/***/ }),

/***/ "./src/modules/countries/countries.service.ts":
/*!****************************************************!*\
  !*** ./src/modules/countries/countries.service.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CountriesService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const country_schema_1 = __webpack_require__(/*! ./schemas/country.schema */ "./src/modules/countries/schemas/country.schema.ts");
const slugify_1 = __importDefault(__webpack_require__(/*! slugify */ "slugify"));
let CountriesService = class CountriesService {
    constructor(countryModel) {
        this.countryModel = countryModel;
    }
    generateSlug(text) {
        return (0, slugify_1.default)(text, { lower: true, strict: true });
    }
    async create(createCountryDto, userId) {
        if (!createCountryDto.slug) {
            createCountryDto.slug = this.generateSlug(createCountryDto.name);
        }
        const existingCountry = await this.countryModel.findOne({
            $or: [{ name: createCountryDto.name }, { slug: createCountryDto.slug }],
        });
        if (existingCountry) {
            throw new common_1.ConflictException("Country with this name or slug already exists.");
        }
        const newCountry = new this.countryModel(Object.assign(Object.assign({}, createCountryDto), { createdBy: userId, updatedBy: userId }));
        return newCountry.save();
    }
    async findAll(query = {}) {
        const { search, page = '1', limit = '6' } = query;
        const parsedPage = parseInt(page, 10);
        const parsedLimit = parseInt(limit, 10);
        const skip = (parsedPage - 1) * parsedLimit;
        const filter = {};
        if (search) {
            filter.$text = { $search: search };
        }
        const [countries, total] = await Promise.all([
            this.countryModel
                .find(filter)
                .sort({ createdAt: 1 })
                .skip(skip)
                .limit(parsedLimit)
                .populate("createdBy", "name email")
                .exec(),
            this.countryModel.countDocuments(filter).exec(),
        ]);
        const totalPages = Math.ceil(total / parsedLimit);
        return {
            data: countries,
            total,
            page: parsedPage,
            limit: parsedLimit,
            totalPages,
        };
    }
    async findOne(id) {
        const country = await this.countryModel.findById(id).populate("createdBy", "name email").exec();
        if (!country) {
            throw new common_1.NotFoundException(`Country with ID ${id} not found.`);
        }
        return country;
    }
    async findBySlug(slug) {
        const country = await this.countryModel.findOne({ slug }).populate("createdBy", "name email").exec();
        if (!country) {
            throw new common_1.NotFoundException(`Country with slug ${slug} not found.`);
        }
        return country;
    }
    async update(id, updateCountryDto, userId) {
        if (updateCountryDto.name && !updateCountryDto.slug) {
            updateCountryDto.slug = this.generateSlug(updateCountryDto.name);
        }
        if (updateCountryDto.slug) {
            const existingCountry = await this.countryModel.findOne({
                slug: updateCountryDto.slug,
                _id: { $ne: id },
            });
            if (existingCountry) {
                throw new common_1.ConflictException("Country with this slug already exists.");
            }
        }
        const updatedCountry = await this.countryModel
            .findByIdAndUpdate(id, Object.assign(Object.assign({}, updateCountryDto), { updatedBy: userId }), { new: true })
            .exec();
        if (!updatedCountry) {
            throw new common_1.NotFoundException(`Country with ID ${id} not found.`);
        }
        return updatedCountry;
    }
    async remove(id) {
        const deletedCountry = await this.countryModel.findByIdAndDelete(id).exec();
        if (!deletedCountry) {
            throw new common_1.NotFoundException(`Country with ID ${id} not found.`);
        }
        return deletedCountry;
    }
    async findStaticHeaderCountries() {
        const staticCountryNames = ["Uganda", "Kenya", "Rwanda", "Tanzania"];
        const countries = await this.countryModel.find({
            name: { $in: staticCountryNames }
        })
            .select('name code slug')
            .sort({ createdAt: 1 })
            .exec();
        return countries;
    }
    async findOtherHeaderCountries() {
        const staticCountryNames = ["Uganda", "Kenya", "Rwanda", "Tanzania"];
        const countries = await this.countryModel.find({
            name: { $nin: staticCountryNames }
        })
            .select('name code slug')
            .sort({ createdAt: 1 })
            .exec();
        return countries;
    }
};
CountriesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(country_schema_1.Country.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], CountriesService);
exports.CountriesService = CountriesService;


/***/ }),

/***/ "./src/modules/countries/schemas/country.schema.ts":
/*!*********************************************************!*\
  !*** ./src/modules/countries/schemas/country.schema.ts ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CountrySchema = exports.Country = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const mongoose = __importStar(__webpack_require__(/*! mongoose */ "mongoose"));
let Country = class Country extends mongoose_2.Document {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Country.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Country.prototype, "code", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Country.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Country.prototype, "overview", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Country.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Country.prototype, "summary", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Country.prototype, "coverImage", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Country.prototype, "galleryImages", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Country.prototype, "seoTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Country.prototype, "seoDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Country.prototype, "seoKeywords", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Country.prototype, "seoCanonicalUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Country.prototype, "seoOgImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: "User" }),
    __metadata("design:type", Object)
], Country.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: "User" }),
    __metadata("design:type", Object)
], Country.prototype, "updatedBy", void 0);
Country = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Country);
exports.Country = Country;
exports.CountrySchema = mongoose_1.SchemaFactory.createForClass(Country);
exports.CountrySchema.index({ name: "text", overview: "text", description: "text", seoKeywords: "text" });


/***/ }),

/***/ "./src/modules/dashboard/dashboard.controller.ts":
/*!*******************************************************!*\
  !*** ./src/modules/dashboard/dashboard.controller.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DashboardController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const session_auth_guard_1 = __webpack_require__(/*! ../auth/guards/session-auth.guard */ "./src/modules/auth/guards/session-auth.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./src/modules/auth/decorators/roles.decorator.ts");
const user_schema_1 = __webpack_require__(/*! ../users/schemas/user.schema */ "./src/modules/users/schemas/user.schema.ts");
const express_1 = __webpack_require__(/*! express */ "express");
const blogs_service_1 = __webpack_require__(/*! ../blogs/blogs.service */ "./src/modules/blogs/blogs.service.ts");
const tours_service_1 = __webpack_require__(/*! ../tours/tours.service */ "./src/modules/tours/tours.service.ts");
const bookings_service_1 = __webpack_require__(/*! ../bookings/bookings.service */ "./src/modules/bookings/bookings.service.ts");
const reviews_service_1 = __webpack_require__(/*! ../reviews/reviews.service */ "./src/modules/reviews/reviews.service.ts");
const subscribers_service_1 = __webpack_require__(/*! ../subscribers/subscribers.service */ "./src/modules/subscribers/subscribers.service.ts");
let DashboardController = class DashboardController {
    constructor(blogsService, toursService, bookingsService, reviewsService, subscribersService) {
        this.blogsService = blogsService;
        this.toursService = toursService;
        this.bookingsService = bookingsService;
        this.reviewsService = reviewsService;
        this.subscribersService = subscribersService;
    }
    async getDashboard(req, query) {
        const user = req.user;
        const isUserAdmin = user.role === user_schema_1.UserRole.ADMIN;
        let tours = [];
        let bookings = [];
        let blogs = [];
        let reviews = [];
        let subscribers = [];
        let recentBookings = [];
        let pendingReviews = [];
        const pageNum = query.page ? parseInt(query.page.toString(), 10) : 1;
        const limitNum = query.limit ? parseInt(query.limit.toString(), 10) : 5;
        const sortBy = query.sortBy || 'newest';
        const commonQueryOptionsForNumbers = {
            page: pageNum,
            limit: limitNum,
            sortBy: sortBy
        };
        const commonQueryOptionsForStrings = {
            page: pageNum.toString(),
            limit: limitNum.toString(),
            sortBy: sortBy
        };
        try {
            if (isUserAdmin) {
                const [toursResult, bookingsArray, blogsResult, reviewsArray, subscribersArray] = await Promise.all([
                    this.toursService.findAll(commonQueryOptionsForStrings),
                    this.bookingsService.findAll(commonQueryOptionsForStrings),
                    this.blogsService.findAll(commonQueryOptionsForNumbers),
                    this.reviewsService.findAll(commonQueryOptionsForStrings),
                    this.subscribersService.findAll(commonQueryOptionsForStrings),
                ]);
                tours = toursResult.tours;
                bookings = bookingsArray;
                blogs = blogsResult.blogs;
                reviews = reviewsArray;
                subscribers = subscribersArray;
                recentBookings = bookings.slice(0, 5);
                pendingReviews = reviews.filter(review => review.status === 'pending');
            }
            else {
                const [toursResult, bookingsArray, blogsResult] = await Promise.all([
                    this.toursService.findAll(Object.assign(Object.assign({}, commonQueryOptionsForStrings), { createdBy: user._id.toString() })),
                    this.bookingsService.findAll(Object.assign(Object.assign({}, commonQueryOptionsForStrings), { agent: user._id.toString() })),
                    this.blogsService.findAll(Object.assign(Object.assign({}, commonQueryOptionsForNumbers), { author: user._id.toString() })),
                ]);
                tours = toursResult.tours;
                bookings = bookingsArray;
                blogs = blogsResult.blogs;
                recentBookings = [];
                pendingReviews = [];
            }
        }
        catch (error) {
            console.error("Error fetching dashboard data:", error);
            req.flash("error_msg", "Failed to load some dashboard data. Please try again.");
            tours = [];
            bookings = [];
            blogs = [];
            reviews = [];
            subscribers = [];
            recentBookings = [];
            pendingReviews = [];
        }
        return {
            title: 'Dashboard',
            user: user,
            layout: 'layouts/dashboard',
            stats: {
                tours: tours.length,
                bookings: bookings.length,
                blogs: blogs.length,
                reviews: reviews.length,
                subscribers: subscribers.length,
                pendingReviews: pendingReviews.length,
            },
            recentBookings: recentBookings,
            pendingReviews: pendingReviews,
            messages: req.flash(),
        };
    }
    getPendingApprovalPage(req) {
        return {
            title: 'Account Pending Approval',
            user: req.user,
            layout: 'layouts/auth',
        };
    }
};
__decorate([
    (0, common_1.Get)('index'),
    (0, common_1.Render)('dashboard/index'),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN, user_schema_1.UserRole.AGENT),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _f : Object, Object]),
    __metadata("design:returntype", Promise)
], DashboardController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('pending-approval'),
    (0, common_1.Render)('auth/pending-approval'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "getPendingApprovalPage", null);
DashboardController = __decorate([
    (0, common_1.Controller)("dashboard"),
    __metadata("design:paramtypes", [typeof (_a = typeof blogs_service_1.BlogsService !== "undefined" && blogs_service_1.BlogsService) === "function" ? _a : Object, typeof (_b = typeof tours_service_1.ToursService !== "undefined" && tours_service_1.ToursService) === "function" ? _b : Object, typeof (_c = typeof bookings_service_1.BookingsService !== "undefined" && bookings_service_1.BookingsService) === "function" ? _c : Object, typeof (_d = typeof reviews_service_1.ReviewsService !== "undefined" && reviews_service_1.ReviewsService) === "function" ? _d : Object, typeof (_e = typeof subscribers_service_1.SubscribersService !== "undefined" && subscribers_service_1.SubscribersService) === "function" ? _e : Object])
], DashboardController);
exports.DashboardController = DashboardController;


/***/ }),

/***/ "./src/modules/dashboard/dashboard.module.ts":
/*!***************************************************!*\
  !*** ./src/modules/dashboard/dashboard.module.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DashboardModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const dashboard_controller_1 = __webpack_require__(/*! ./dashboard.controller */ "./src/modules/dashboard/dashboard.controller.ts");
const tours_module_1 = __webpack_require__(/*! ../tours/tours.module */ "./src/modules/tours/tours.module.ts");
const bookings_module_1 = __webpack_require__(/*! ../bookings/bookings.module */ "./src/modules/bookings/bookings.module.ts");
const blogs_module_1 = __webpack_require__(/*! ../blogs/blogs.module */ "./src/modules/blogs/blogs.module.ts");
const reviews_module_1 = __webpack_require__(/*! ../reviews/reviews.module */ "./src/modules/reviews/reviews.module.ts");
const subscribers_module_1 = __webpack_require__(/*! ../subscribers/subscribers.module */ "./src/modules/subscribers/subscribers.module.ts");
let DashboardModule = class DashboardModule {
};
DashboardModule = __decorate([
    (0, common_1.Module)({
        imports: [tours_module_1.ToursModule, bookings_module_1.BookingsModule, blogs_module_1.BlogsModule, reviews_module_1.ReviewsModule, subscribers_module_1.SubscribersModule],
        controllers: [dashboard_controller_1.DashboardController],
    })
], DashboardModule);
exports.DashboardModule = DashboardModule;


/***/ }),

/***/ "./src/modules/enquiry/dtos/enquiry.dto.ts":
/*!*************************************************!*\
  !*** ./src/modules/enquiry/dtos/enquiry.dto.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateEnquiryDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class CreateEnquiryDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEnquiryDto.prototype, "fullName", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateEnquiryDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsPhoneNumber)('UG'),
    __metadata("design:type", String)
], CreateEnquiryDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEnquiryDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEnquiryDto.prototype, "travelDate", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEnquiryDto.prototype, "numberOfTravelers", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEnquiryDto.prototype, "message", void 0);
exports.CreateEnquiryDto = CreateEnquiryDto;


/***/ }),

/***/ "./src/modules/mail/mail.module.ts":
/*!*****************************************!*\
  !*** ./src/modules/mail/mail.module.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MailModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const nodemailer = __importStar(__webpack_require__(/*! nodemailer */ "nodemailer"));
const mail_service_1 = __webpack_require__(/*! ./mail.service */ "./src/modules/mail/mail.service.ts");
const MailerProvider = {
    provide: "MAILER_TRANSPORT",
    useFactory: async () => {
        return nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: +process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    },
};
let MailModule = class MailModule {
};
MailModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [MailerProvider, mail_service_1.MailService],
        exports: [mail_service_1.MailService],
    })
], MailModule);
exports.MailModule = MailModule;


/***/ }),

/***/ "./src/modules/mail/mail.service.ts":
/*!******************************************!*\
  !*** ./src/modules/mail/mail.service.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MailService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const config_1 = __webpack_require__(/*! @nestjs/config */ "@nestjs/config");
const nodemailer = __importStar(__webpack_require__(/*! nodemailer */ "nodemailer"));
let MailService = class MailService {
    constructor(configService) {
        this.configService = configService;
        this.transporter = nodemailer.createTransport({
            host: this.configService.get("MAIL_HOST"),
            port: this.configService.get("MAIL_PORT"),
            secure: this.configService.get("MAIL_SECURE"),
            auth: {
                user: this.configService.get("MAIL_USER"),
                pass: this.configService.get("MAIL_PASSWORD"),
            },
        });
    }
    async sendNewAgentNotification(agent) {
        const adminEmail = this.configService.get("ADMIN_EMAIL") || "asiomizunoah@gmail.com";
        await this.transporter.sendMail({
            from: `"Roads of Adventure Safaris" <${this.configService.get("MAIL_FROM")}>`,
            to: adminEmail,
            subject: "New Agent Registration",
            html: `
        <h1>New Agent Registration</h1>
        <p>A new agent has registered and is awaiting approval:</p>
        <ul>
          <li><strong>Name:</strong> ${agent.name}</li>
          <li><strong>Email:</strong> ${agent.email}</li>
          <li><strong>Company:</strong> ${agent.companyName || "N/A"}</li>
          <li><strong>Phone:</strong> ${agent.phoneNumber || "N/A"}</li>
          <li><strong>Country:</strong> ${agent.country || "N/A"}</li>
        </ul>
        <p>Please login to the dashboard to approve or reject this agent.</p>
      `,
        });
    }
    async sendAgentActivationEmail(agent) {
        await this.transporter.sendMail({
            from: `"Roads of Adventure Safaris" <${this.configService.get("MAIL_FROM")}>`,
            to: agent.email,
            subject: "Your Agent Account has been Activated",
            html: `
        <h1>Account Activated</h1>
        <p>Dear ${agent.name},</p>
        <p>Your agent account with Roads of Adventure Safaris has been approved and activated. You can now log in to the dashboard and start managing tours.</p>
        <p><a href="${this.configService.get("WEBSITE_URL")}/auth/login">Click here to login</a></p>
        <p>Thank you for partnering with us!</p>
      `,
        });
    }
    async sendAgentDeactivationEmail(agent) {
        await this.transporter.sendMail({
            from: `"Roads of Adventure Safaris" <${this.configService.get("MAIL_FROM")}>`,
            to: agent.email,
            subject: "Your Agent Account has been Deactivated",
            html: `
        <h1>Account Deactivated</h1>
        <p>Dear ${agent.name},</p>
        <p>Your agent account with Roads of Adventure Safaris has been deactivated. Please contact our admin team for more information.</p>
        <p>Email: ${this.configService.get("ADMIN_EMAIL") || "asiomizunoah@gmail.com"}</p>
      `,
        });
    }
    async sendPasswordResetEmail(user, token) {
        const resetUrl = `${this.configService.get("WEBSITE_URL")}/auth/reset-password/${token}`;
        await this.transporter.sendMail({
            from: `"Roads of Adventure Safaris" <${this.configService.get("MAIL_FROM")}>`,
            to: user.email,
            subject: "Password Reset Request",
            html: `
        <h1>Password Reset</h1>
        <p>Dear ${user.name},</p>
        <p>You requested a password reset. Please click the link below to reset your password:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      `,
        });
        console.log(`Reset link: ${resetUrl}`);
    }
    async sendPasswordChangedEmail(user) {
        await this.transporter.sendMail({
            from: `"Roads of Adventure Safaris" <${this.configService.get("MAIL_FROM")}>`,
            to: user.email,
            subject: "Password Changed Successfully",
            html: `
        <h1>Password Changed</h1>
        <p>Dear ${user.name},</p>
        <p>Your password has been changed successfully.</p>
        <p>If you did not make this change, please contact us immediately.</p>
      `,
        });
    }
    async sendNewBlogNotification(blog, subscribers) {
        const blogUrl = `${this.configService.get("WEBSITE_URL")}/blogs/${blog.slug}`;
        for (const subscriber of subscribers) {
            await this.transporter.sendMail({
                from: `"Roads of Adventure Safaris" <${this.configService.get("MAIL_FROM")}>`,
                to: subscriber.email,
                subject: `New Safari Update: ${blog.title}`,
                html: `
          <h1>${blog.title}</h1>
          <p>${blog.excerpt || blog.content.substring(0, 200)}...</p>
          <p><a href="${blogUrl}">Read More</a></p>
          <p>Thank you for subscribing to our newsletter!</p>
          <p>If you no longer wish to receive these emails, please <a href="${this.configService.get("WEBSITE_URL")}/unsubscribe?email=${subscriber.email}">unsubscribe</a>.</p>
        `,
            });
        }
    }
    async sendSubscriptionConfirmation(subscriber) {
        console.log(`MailService: Preparing subscription confirmation for: ${subscriber.email}`);
        if (!subscriber.email) {
            console.error("MailService: Subscriber email is undefined or empty for confirmation email!");
            throw new Error("No recipient email defined for subscription confirmation.");
        }
        const mailOptions = {
            from: `"Roads of Adventure" <${this.configService.get('EMAIL_USER')}>`,
            to: subscriber.email,
            subject: `Welcome to the Roads of Adventure Newsletter!`,
            html: `
        <h2>Hello<%= subscriber.name ? ' ' + subscriber.name : '' %>,</h2>
        <p>Thank you for subscribing to our newsletter! You'll now receive our latest news, tour updates, and exclusive offers.</p>
        <p>Get ready to explore the world with Roads of Adventure!</p>
        <p>Best regards,<br>The Roads of Adventure Team</p>
        <p>If you wish to unsubscribe at any time, please click here: <a href="${this.configService.get('BASE_URL')}/unsubscribe?email=${subscriber.email}">Unsubscribe</a></p>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`MailService: Successfully sent subscription confirmation to ${subscriber.email}`);
        }
        catch (error) {
            console.error(`MailService: Failed to send subscription confirmation to ${subscriber.email}:`, error);
            throw error;
        }
    }
    async sendNewSubscriberNotification(subscriber) {
        const adminEmail = this.configService.get("ADMIN_EMAIL") || "asiomizunoah@gmail.com";
        const mailOptions = {
            from: `"Roads of Adventure" <${this.configService.get('EMAIL_USER')}>`,
            to: adminEmail,
            subject: `New Newsletter Subscriber: ${subscriber.email}`,
            html: `
        <h2>New Newsletter Subscriber!</h2>
        <p>A new email address has subscribed to your newsletter:</p>
        <ul>
          <li><strong>Email:</strong> ${subscriber.email}</li>
          <li><strong>Name:</strong> ${subscriber.name || 'N/A'}</li>
          <li><strong>Phone:</strong> ${subscriber.phoneNumber || 'N/A'}</li>
          <li><strong>Subscribed On:</strong> ${new Date(subscriber.createdAt).toLocaleString()}</li>
        </ul>
        <p>View all subscribers in your dashboard: <a href="${this.configService.get('BASE_URL')}/subscribers/dashboard">View Subscribers</a></p>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`MailService: Successfully sent new subscriber notification to admin (${this.adminEmail})`);
        }
        catch (error) {
            console.error(`MailService: Failed to send new subscriber notification to admin (${this.adminEmail}):`, error);
            throw error;
        }
    }
    async sendBookingNotification(booking) {
        const adminEmail = this.configService.get("ADMIN_EMAIL") || "asiomizunoah@gmail.com";
        await this.transporter.sendMail({
            from: `"Roads of Adventure Safaris" <${this.configService.get("MAIL_FROM")}>`,
            to: adminEmail,
            subject: "New Tour Booking",
            html: `
        <h1>New Tour Booking</h1>
        <p>A new booking has been received:</p>
        <ul>
          <li><strong>Name:</strong> ${booking.fullName}</li>
          <li><strong>Email:</strong> ${booking.email}</li>
          <li><strong>Phone:</strong> ${booking.phoneNumber || "N/A"}</li>
          <li><strong>Country:</strong> ${booking.country || "N/A"}</li>
          <li><strong>Tour:</strong> ${booking.tour ? "Selected Tour" : "Custom Tour Request"}</li>
          <li><strong>Travel Date:</strong> ${booking.travelDate ? new Date(booking.travelDate).toLocaleDateString() : "N/A"}</li>
          <li><strong>Adults:</strong> ${booking.numberOfAdults || 0}</li>
          <li><strong>Children:</strong> ${booking.numberOfChildren || 0}</li>
          <li><strong>Special Requirements:</strong> ${booking.specialRequirements || "None"}</li>
        </ul>
        ${booking.customTourRequest ? `<p><strong>Custom Tour Request:</strong> ${booking.customTourRequest}</p>` : ""}
        <p>Please login to the dashboard to manage this booking.</p>
      `,
        });
    }
    async sendBookingConfirmation(booking) {
        await this.transporter.sendMail({
            from: `"Roads of Adventure Safaris" <${this.configService.get("MAIL_FROM")}>`,
            to: booking.email,
            subject: "Your Safari Booking Confirmation",
            html: `
        <h1>Booking Received</h1>
        <p>Dear ${booking.fullName},</p>
        <p>Thank you for your booking with Roads of Adventure Safaris. We have received your request and will contact you shortly to discuss the details.</p>
        <h2>Booking Details:</h2>
        <ul>
          <li><strong>Tour:</strong> ${booking.tour ? "Selected Tour" : "Custom Tour Request"}</li>
          <li><strong>Travel Date:</strong> ${booking.travelDate ? new Date(booking.travelDate).toLocaleDateString() : "N/A"}</li>
          <li><strong>Number of Travelers:</strong> ${(booking.numberOfAdults || 0) + (booking.numberOfChildren || 0)}</li>
        </ul>
        <p>If you have any questions, please don't hesitate to contact us.</p>
        <p>We look forward to helping you plan your African adventure!</p>
      `,
        });
    }
    async sendBookingStatusUpdate(booking) {
        let statusMessage = "";
        let subject = "";
        switch (booking.status) {
            case "confirmed":
                subject = "Your Safari Booking is Confirmed";
                statusMessage = "Your booking has been confirmed. We are excited to have you join us on this adventure!";
                break;
            case "cancelled":
                subject = "Your Safari Booking has been Cancelled";
                statusMessage =
                    "Your booking has been cancelled. If you did not request this cancellation, please contact us immediately.";
                break;
            case "completed":
                subject = "Thank You for Your Safari with Us";
                statusMessage = "Your safari has been marked as completed. We hope you had a wonderful experience with us!";
                break;
            default:
                subject = "Your Safari Booking Status Update";
                statusMessage = "There has been an update to your booking status.";
        }
        await this.transporter.sendMail({
            from: `"Roads of Adventure Safaris" <${this.configService.get("MAIL_FROM")}>`,
            to: booking.email,
            subject,
            html: `
        <h1>Booking Status Update</h1>
        <p>Dear ${booking.fullName},</p>
        <p>${statusMessage}</p>
        <h2>Booking Details:</h2>
        <ul>
          <li><strong>Tour:</strong> ${booking.tour ? "Selected Tour" : "Custom Tour Request"}</li>
          <li><strong>Travel Date:</strong> ${booking.travelDate ? new Date(booking.travelDate).toLocaleDateString() : "N/A"}</li>
          <li><strong>Status:</strong> ${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</li>
        </ul>
        <p>If you have any questions, please don't hesitate to contact us.</p>
      `,
        });
    }
    async sendEnquiryToAdmin(enquiry) {
        const adminEmail = this.configService.get("ADMIN_EMAIL") || "asiomizunoah@gmail.com";
        await this.transporter.sendMail({
            from: `"Roads of Adventure safaris" <${this.configService.get("MAIL_FROM")}>`,
            to: adminEmail,
            subject: `New Safari Enquiry from ${enquiry.fullName}`,
            html: `
        <h1>Safari Enquiry</h1>
        <p>You have received a new enquiry from your Roads Of Adventure Safaris:</p>
        <ul>
          <li><strong>Full Name:</strong> ${enquiry.fullName}</li>
          <li><strong>Email Address:</strong> ${enquiry.email}</li>
          <li><strong>Phone Number:</strong> ${enquiry.phoneNumber}</li>
          <li><strong>Country of Residence:</strong> ${enquiry.country}</li>
          <li><strong>Preferred Travel Date:</strong> ${enquiry.travelDate || 'Not specified'}</li>
          <li><strong>Number of Travelers:</strong> ${enquiry.numberOfTravelers}</li>
        </ul>
        <h3>Message:</h3>
        <p>${enquiry.message}</p>
        <br>
        <p>Please respond to this enquiry as soon as possible.</p>
      `,
        });
    }
};
MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], MailService);
exports.MailService = MailService;


/***/ }),

/***/ "./src/modules/pages/pages.controller.ts":
/*!***********************************************!*\
  !*** ./src/modules/pages/pages.controller.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PagesController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const platform_express_1 = __webpack_require__(/*! @nestjs/platform-express */ "@nestjs/platform-express");
const express_1 = __webpack_require__(/*! express */ "express");
const pages_service_1 = __webpack_require__(/*! ./pages.service */ "./src/modules/pages/pages.service.ts");
const session_auth_guard_1 = __webpack_require__(/*! ../auth/guards/session-auth.guard */ "./src/modules/auth/guards/session-auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../auth/guards/roles.guard */ "./src/modules/auth/guards/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./src/modules/auth/decorators/roles.decorator.ts");
const user_schema_1 = __webpack_require__(/*! ../users/schemas/user.schema */ "./src/modules/users/schemas/user.schema.ts");
const page_schema_1 = __webpack_require__(/*! ./schemas/page.schema */ "./src/modules/pages/schemas/page.schema.ts");
const multer_config_1 = __webpack_require__(/*! ../../config/multer.config */ "./src/config/multer.config.ts");
let PagesController = class PagesController {
    constructor(pagesService) {
        this.pagesService = pagesService;
    }
    async getPages(query, req) {
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
                pageStatuses: Object.values(page_schema_1.PageStatus),
            };
        }
        catch (error) {
            console.error("Error fetching dashboard pages:", error);
            req.flash("error_msg", "Failed to load pages: " + error.message);
            return {
                title: "Pages - Dashboard",
                pages: [],
                user: req.user,
                query: { search: "", status: "", page: 1, limit: 10 },
                totalPages: 0,
                currentPage: 1,
                layout: "layouts/dashboard",
                messages: req.flash(),
                pageStatuses: Object.values(page_schema_1.PageStatus),
            };
        }
    }
    getAddPagePage(req) {
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
            pageTypes: Object.values(page_schema_1.PageType),
            pageStatuses: Object.values(page_schema_1.PageStatus),
        };
    }
    async addPage(createPageDto, files, req, res) {
        try {
            const categorizedFiles = {};
            files.forEach(file => {
                if (!categorizedFiles[file.fieldname]) {
                    categorizedFiles[file.fieldname] = [];
                }
                categorizedFiles[file.fieldname].push(file);
            });
            if (categorizedFiles.coverImage && categorizedFiles.coverImage.length > 0) {
                createPageDto.coverImage = `/uploads/pages/${categorizedFiles.coverImage[0].filename}`;
            }
            else if (createPageDto.coverImage === '') {
                createPageDto.coverImage = null;
            }
            if (categorizedFiles.galleryImages && categorizedFiles.galleryImages.length > 0) {
                createPageDto.galleryImages = categorizedFiles.galleryImages.map((file) => `/uploads/pages/${file.filename}`);
            }
            else if (createPageDto.galleryImages && createPageDto.galleryImages.length === 0) {
                createPageDto.galleryImages = [];
            }
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
        }
        catch (error) {
            console.error("Error adding page:", error);
            let flashMessage = "Failed to add page.";
            if (error instanceof common_1.HttpException) {
                const response = error.getResponse();
                if (typeof response === "object" && response !== null && "message" in response) {
                    if (Array.isArray(response.message)) {
                        flashMessage = response.message.join(", ");
                    }
                    else {
                        flashMessage = response.message;
                    }
                }
                else if (typeof response === "string") {
                    flashMessage = response;
                }
                else {
                    flashMessage = error.message || "An unknown error occurred.";
                }
            }
            else if (error.message) {
                if (error.code === 11000 && error.keyPattern && error.keyValue) {
                    if (error.keyPattern.slug)
                        flashMessage = "A page with this slug already exists. Please choose a different title or slug.";
                    else if (error.keyPattern.title)
                        flashMessage = "A page with this title already exists.";
                    else
                        flashMessage = "A duplicate entry error occurred.";
                }
                else {
                    flashMessage = error.message;
                }
            }
            req.flash("error_msg", flashMessage);
            req.flash("oldInput", createPageDto);
            return res.redirect("/pages/dashboard/add");
        }
    }
    async getEditPagePage(id, req, res) {
        try {
            const page = await this.pagesService.findOne(id);
            if (!page) {
                throw new common_1.NotFoundException(`Page with ID ${id} not found.`);
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
                pageTypes: Object.values(page_schema_1.PageType),
                pageStatuses: Object.values(page_schema_1.PageStatus),
            };
        }
        catch (error) {
            console.error("Error fetching page for edit:", error);
            req.flash("error_msg", error.message || "Failed to load page for editing.");
            return res.redirect("/pages/dashboard");
        }
    }
    async updatePage(id, updatePageDto, files, req, res) {
        try {
            const existingPage = await this.pagesService.findOne(id);
            if (!existingPage) {
                throw new common_1.NotFoundException(`Page with ID ${id} not found.`);
            }
            const categorizedFiles = {};
            files.forEach(file => {
                if (!categorizedFiles[file.fieldname]) {
                    categorizedFiles[file.fieldname] = [];
                }
                categorizedFiles[file.fieldname].push(file);
            });
            if (categorizedFiles.coverImage && categorizedFiles.coverImage.length > 0) {
                updatePageDto.coverImage = `/uploads/pages/${categorizedFiles.coverImage[0].filename}`;
            }
            else if (updatePageDto.coverImage === '') {
                updatePageDto.coverImage = null;
            }
            else {
                updatePageDto.coverImage = existingPage.coverImage;
            }
            if (categorizedFiles.galleryImages && categorizedFiles.galleryImages.length > 0) {
                updatePageDto.galleryImages = categorizedFiles.galleryImages.map((file) => `/uploads/pages/${file.filename}`);
            }
            else if (updatePageDto.galleryImages && updatePageDto.galleryImages.length === 0) {
                updatePageDto.galleryImages = [];
            }
            else {
                updatePageDto.galleryImages = existingPage.galleryImages;
            }
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
        }
        catch (error) {
            console.error("Error updating page:", error);
            let flashMessage = "Failed to update page.";
            if (error instanceof common_1.HttpException) {
                const response = error.getResponse();
                if (typeof response === "object" && response !== null && "message" in response) {
                    if (Array.isArray(response.message)) {
                        flashMessage = response.message.join(", ");
                    }
                    else {
                        flashMessage = response.message;
                    }
                }
                else if (typeof response === "string") {
                    flashMessage = response;
                }
                else {
                    flashMessage = error.message || "An unknown error occurred.";
                }
            }
            else if (error.message) {
                if (error.code === 11000 && error.keyPattern && error.keyValue) {
                    if (error.keyPattern.slug)
                        flashMessage = "A page with this slug already exists. Please choose a different title or slug.";
                    else
                        flashMessage = "A duplicate entry error occurred.";
                }
                else {
                    flashMessage = error.message;
                }
            }
            req.flash("error_msg", flashMessage);
            req.flash("oldInput", updatePageDto);
            return res.redirect(`/pages/dashboard/edit/${id}`);
        }
    }
    async deletePage(id, req, res) {
        try {
            await this.pagesService.remove(id);
            req.flash("success_msg", "Page deleted successfully");
            return res.redirect("/pages/dashboard");
        }
        catch (error) {
            console.error("Error deleting page:", error);
            req.flash("error_msg", error.message || "Failed to delete page.");
            return res.redirect("/pages/dashboard");
        }
    }
    async updatePageStatus(id, status, req, res) {
        try {
            if (!Object.values(page_schema_1.PageStatus).includes(status)) {
                throw new common_1.BadRequestException(`Invalid page status: ${status}`);
            }
            await this.pagesService.updateStatus(id, status, req.user.id);
            req.flash("success_msg", `Page status updated to ${status}`);
            return res.redirect("/pages/dashboard");
        }
        catch (error) {
            console.error("Error updating page status:", error);
            req.flash("error_msg", error.message || "Failed to update page status.");
            return res.redirect("/pages/dashboard");
        }
    }
    async getPublicSinglePage(slug, req, res) {
        try {
            const page = await this.pagesService.findBySlug(slug);
            if (!page) {
                throw new common_1.NotFoundException(`Page with slug '${slug}' not found or not published.`);
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
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                req.flash('error_msg', error.message);
                return res.redirect('/pages');
            }
            console.error('Error loading public page:', error);
            req.flash('error_msg', 'An unexpected error occurred while loading the page.');
            return res.redirect('/pages');
        }
    }
};
__decorate([
    (0, common_1.Get)("dashboard"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, common_1.Render)("dashboard/pages/index"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PagesController.prototype, "getPages", null);
__decorate([
    (0, common_1.Get)("dashboard/add"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, common_1.Render)("dashboard/pages/add"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PagesController.prototype, "getAddPagePage", null);
__decorate([
    (0, common_1.Post)("dashboard/add"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)((0, multer_config_1.getMulterConfig)('pages'))),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof Array !== "undefined" && Array) === "function" ? _b : Object, Object, typeof (_c = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], PagesController.prototype, "addPage", null);
__decorate([
    (0, common_1.Get)("dashboard/edit/:id"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, common_1.Render)("dashboard/pages/edit"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_d = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], PagesController.prototype, "getEditPagePage", null);
__decorate([
    (0, common_1.Patch)("dashboard/edit/:id"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, common_1.UseInterceptors)((0, platform_express_1.AnyFilesInterceptor)((0, multer_config_1.getMulterConfig)('pages'))),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __param(3, (0, common_1.Req)()),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_e = typeof Array !== "undefined" && Array) === "function" ? _e : Object, Object, typeof (_f = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], PagesController.prototype, "updatePage", null);
__decorate([
    (0, common_1.Delete)("dashboard/:id"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_g = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _g : Object]),
    __metadata("design:returntype", Promise)
], PagesController.prototype, "deletePage", null);
__decorate([
    (0, common_1.Patch)("dashboard/status/:id/:status"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Param)("status")),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_h = typeof page_schema_1.PageStatus !== "undefined" && page_schema_1.PageStatus) === "function" ? _h : Object, Object, typeof (_j = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _j : Object]),
    __metadata("design:returntype", Promise)
], PagesController.prototype, "updatePageStatus", null);
__decorate([
    (0, common_1.Get)(":slug"),
    (0, common_1.Render)("public/pages/show"),
    __param(0, (0, common_1.Param)("slug")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_k = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _k : Object]),
    __metadata("design:returntype", Promise)
], PagesController.prototype, "getPublicSinglePage", null);
PagesController = __decorate([
    (0, common_1.Controller)("pages"),
    __metadata("design:paramtypes", [typeof (_a = typeof pages_service_1.PagesService !== "undefined" && pages_service_1.PagesService) === "function" ? _a : Object])
], PagesController);
exports.PagesController = PagesController;


/***/ }),

/***/ "./src/modules/pages/pages.module.ts":
/*!*******************************************!*\
  !*** ./src/modules/pages/pages.module.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PagesModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const pages_service_1 = __webpack_require__(/*! ./pages.service */ "./src/modules/pages/pages.service.ts");
const pages_controller_1 = __webpack_require__(/*! ./pages.controller */ "./src/modules/pages/pages.controller.ts");
const page_schema_1 = __webpack_require__(/*! ./schemas/page.schema */ "./src/modules/pages/schemas/page.schema.ts");
let PagesModule = class PagesModule {
};
PagesModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: page_schema_1.Page.name, schema: page_schema_1.PageSchema }])],
        controllers: [pages_controller_1.PagesController],
        providers: [pages_service_1.PagesService],
        exports: [pages_service_1.PagesService],
    })
], PagesModule);
exports.PagesModule = PagesModule;


/***/ }),

/***/ "./src/modules/pages/pages.service.ts":
/*!********************************************!*\
  !*** ./src/modules/pages/pages.service.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PagesService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const mongoose_2 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const page_schema_1 = __webpack_require__(/*! ./schemas/page.schema */ "./src/modules/pages/schemas/page.schema.ts");
let PagesService = class PagesService {
    constructor(pageModel) {
        this.pageModel = pageModel;
    }
    async create(createPageDto, userId) {
        const existingPage = await this.pageModel.findOne({
            $or: [{ title: createPageDto.title }, { slug: createPageDto.slug }],
        });
        if (existingPage) {
            throw new common_1.ConflictException("Page with this title or slug already exists");
        }
        const newPage = new this.pageModel(Object.assign(Object.assign({}, createPageDto), { createdBy: userId, updatedBy: userId }));
        return newPage.save();
    }
    async findAll(query) {
        const filter = {};
        const page = parseInt(query.page, 10) || 1;
        const limit = parseInt(query.limit, 10) || 10;
        const skip = (page - 1) * limit;
        if (query && query.search) {
            filter.$or = [
                { title: { $regex: query.search, $options: 'i' } },
                { description: { $regex: query.search, $options: 'i' } },
                { seoKeywords: { $regex: query.search, $options: 'i' } },
                { 'contentBlocks.title': { $regex: query.search, $options: 'i' } },
                { 'contentBlocks.content': { $regex: query.search, $options: 'i' } },
            ];
        }
        if (query && query.status && Object.values(page_schema_1.PageStatus).includes(query.status)) {
            filter.status = query.status;
        }
        if (query && query.pageType && Object.values(page_schema_1.PageType).includes(query.pageType)) {
            filter.pageType = query.pageType;
        }
        const totalPagesCount = await this.pageModel.countDocuments(filter);
        const pages = await this.pageModel
            .find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("createdBy", "name email")
            .exec();
        return {
            pages,
            totalPages: Math.ceil(totalPagesCount / limit),
            currentPage: page,
        };
    }
    async findPublished() {
        return this.pageModel
            .find({ status: page_schema_1.PageStatus.PUBLISHED })
            .sort({ createdAt: -1 })
            .populate("createdBy", "name email")
            .exec();
    }
    async findOne(id) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid ID format');
        }
        const page = await this.pageModel.findById(id).populate("createdBy", "name email").exec();
        if (!page) {
            throw new common_1.NotFoundException(`Page with ID ${id} not found`);
        }
        return page;
    }
    async findBySlug(slug) {
        const page = await this.pageModel
            .findOne({ slug, status: page_schema_1.PageStatus.PUBLISHED })
            .populate("createdBy", "name email")
            .exec();
        if (!page) {
            throw new common_1.NotFoundException(`Page with slug ${slug} not found or not published`);
        }
        return page;
    }
    async update(id, updatePageDto, userId) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid ID format');
        }
        if (updatePageDto.slug) {
            const existingPage = await this.pageModel.findOne({
                slug: updatePageDto.slug,
                _id: { $ne: id },
            });
            if (existingPage) {
                throw new common_1.ConflictException("Page with this slug already exists");
            }
        }
        const page = await this.pageModel.findById(id).exec();
        if (!page) {
            throw new common_1.NotFoundException(`Page with ID ${id} not found`);
        }
        Object.assign(page, updatePageDto);
        page.updatedBy = new mongoose_1.Types.ObjectId(userId);
        return page.save();
    }
    async remove(id) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid ID format');
        }
        const deletedPage = await this.pageModel.findByIdAndDelete(id).exec();
        if (!deletedPage) {
            throw new common_1.NotFoundException(`Page with ID ${id} not found`);
        }
        return deletedPage;
    }
    async findOneByType(type) {
        return this.pageModel.findOne({
            pageType: type,
            status: page_schema_1.PageStatus.PUBLISHED,
        }).exec();
    }
    async findOneBySlug(slug) {
        return this.pageModel.findOne({ slug: slug }).exec();
    }
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
    }
    async updateStatus(id, status, userId) {
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid ID format');
        }
        if (!Object.values(page_schema_1.PageStatus).includes(status)) {
            throw new common_1.BadRequestException(`Invalid status provided: ${status}`);
        }
        const updatedPage = await this.pageModel.findByIdAndUpdate(id, {
            $set: {
                status: status,
                updatedBy: new mongoose_1.Types.ObjectId(userId)
            }
        }, { new: true }).exec();
        if (!updatedPage) {
            throw new common_1.NotFoundException(`Page with ID ${id} not found`);
        }
        return updatedPage;
    }
};
PagesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(page_schema_1.Page.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_1.Model !== "undefined" && mongoose_1.Model) === "function" ? _a : Object])
], PagesService);
exports.PagesService = PagesService;


/***/ }),

/***/ "./src/modules/pages/schemas/page.schema.ts":
/*!**************************************************!*\
  !*** ./src/modules/pages/schemas/page.schema.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PageSchema = exports.Page = exports.PageContentBlockSchema = exports.PageContentBlock = exports.PageType = exports.PageStatus = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const mongoose = __importStar(__webpack_require__(/*! mongoose */ "mongoose"));
var PageStatus;
(function (PageStatus) {
    PageStatus["DRAFT"] = "draft";
    PageStatus["PUBLISHED"] = "published";
    PageStatus["ARCHIVED"] = "archived";
})(PageStatus = exports.PageStatus || (exports.PageStatus = {}));
var PageType;
(function (PageType) {
    PageType["ABOUT"] = "about";
    PageType["CONTACT"] = "contact";
    PageType["TERMS"] = "terms";
    PageType["PRIVACY"] = "privacy";
    PageType["FAQ"] = "faq";
    PageType["COMMUNITY"] = "community";
    PageType["CUSTOM"] = "custom";
})(PageType = exports.PageType || (exports.PageType = {}));
let PageContentBlock = class PageContentBlock {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PageContentBlock.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], PageContentBlock.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], PageContentBlock.prototype, "content", void 0);
PageContentBlock = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], PageContentBlock);
exports.PageContentBlock = PageContentBlock;
exports.PageContentBlockSchema = mongoose_1.SchemaFactory.createForClass(PageContentBlock);
let Page = class Page extends mongoose_2.Document {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Page.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Page.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: PageType }),
    __metadata("design:type", String)
], Page.prototype, "pageType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.PageContentBlockSchema], default: [] }),
    __metadata("design:type", Array)
], Page.prototype, "contentBlocks", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Page.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Page.prototype, "coverImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Page.prototype, "galleryImages", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: PageStatus, default: PageStatus.DRAFT }),
    __metadata("design:type", String)
], Page.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Page.prototype, "seoTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Page.prototype, "seoDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], Page.prototype, "seoKeywords", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Page.prototype, "seoCanonicalUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Page.prototype, "seoOgImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: "User" }),
    __metadata("design:type", Object)
], Page.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: "User" }),
    __metadata("design:type", typeof (_b = typeof mongoose_2.Types !== "undefined" && mongoose_2.Types.ObjectId) === "function" ? _b : Object)
], Page.prototype, "updatedBy", void 0);
Page = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true, collection: 'pages' })
], Page);
exports.Page = Page;
exports.PageSchema = mongoose_1.SchemaFactory.createForClass(Page);
exports.PageSchema.index({
    title: "text",
    "contentBlocks.title": "text",
    "contentBlocks.content": "text",
    description: "text",
    seoKeywords: "text",
});


/***/ }),

/***/ "./src/modules/reviews/reviews.controller.ts":
/*!***************************************************!*\
  !*** ./src/modules/reviews/reviews.controller.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReviewsController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const express_1 = __webpack_require__(/*! express */ "express");
const reviews_service_1 = __webpack_require__(/*! ./reviews.service */ "./src/modules/reviews/reviews.service.ts");
const session_auth_guard_1 = __webpack_require__(/*! ../auth/guards/session-auth.guard */ "./src/modules/auth/guards/session-auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../auth/guards/roles.guard */ "./src/modules/auth/guards/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./src/modules/auth/decorators/roles.decorator.ts");
const user_schema_1 = __webpack_require__(/*! ../users/schemas/user.schema */ "./src/modules/users/schemas/user.schema.ts");
const review_schema_1 = __webpack_require__(/*! ./schemas/review.schema */ "./src/modules/reviews/schemas/review.schema.ts");
const tours_service_1 = __webpack_require__(/*! ../tours/tours.service */ "./src/modules/tours/tours.service.ts");
let ReviewsController = class ReviewsController {
    constructor(reviewsService, toursService) {
        this.reviewsService = reviewsService;
        this.toursService = toursService;
    }
    async createReview(createReviewDto, res) {
        try {
            await this.reviewsService.create(createReviewDto);
            return res.redirect(createReviewDto.tour ? `/tours/${createReviewDto.tour}?review=success` : "/?review=success");
        }
        catch (error) {
            return res.redirect(createReviewDto.tour ? `/tours/${createReviewDto.tour}?review=error` : "/?review=error");
        }
    }
    async getReviews(query, req) {
        const reviews = await this.reviewsService.findAll(query);
        const tours = await this.toursService.findAll();
        return {
            title: "Reviews - Dashboard",
            reviews,
            tours,
            user: req.user,
            query,
            layout: "layouts/dashboard",
        };
    }
    async getReview(id, req) {
        const review = await this.reviewsService.findOne(id);
        return {
            title: "View Review - Dashboard",
            review,
            user: req.user,
            layout: "layouts/dashboard",
        };
    }
    async respondToReview(id, updateReviewDto, req, res) {
        try {
            await this.reviewsService.update(id, updateReviewDto);
            req.flash("success_msg", "Response added successfully");
            return res.redirect("/reviews/dashboard");
        }
        catch (error) {
            req.flash("error_msg", error.message);
            return res.redirect(`/reviews/dashboard/view/${id}`);
        }
    }
    async approveReview(id, req, res) {
        try {
            await this.reviewsService.updateStatus(id, review_schema_1.ReviewStatus.APPROVED);
            req.flash("success_msg", "Review approved successfully");
            return res.redirect("/reviews/dashboard");
        }
        catch (error) {
            req.flash("error_msg", error.message);
            return res.redirect("/reviews/dashboard");
        }
    }
    async rejectReview(id, req, res) {
        try {
            await this.reviewsService.updateStatus(id, review_schema_1.ReviewStatus.REJECTED);
            req.flash("success_msg", "Review rejected successfully");
            return res.redirect("/reviews/dashboard");
        }
        catch (error) {
            req.flash("error_msg", error.message);
            return res.redirect("/reviews/dashboard");
        }
    }
    async deleteReview(id, req, res) {
        try {
            await this.reviewsService.remove(id);
            req.flash("success_msg", "Review deleted successfully");
            return res.redirect("/reviews/dashboard");
        }
        catch (error) {
            req.flash("error_msg", error.message);
            return res.redirect("/reviews/dashboard");
        }
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_c = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "createReview", null);
__decorate([
    (0, common_1.Get)("dashboard"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, common_1.Render)("dashboard/reviews/index"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getReviews", null);
__decorate([
    (0, common_1.Get)("dashboard/view/:id"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, common_1.Render)("dashboard/reviews/view"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getReview", null);
__decorate([
    (0, common_1.Post)("dashboard/respond/:id"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, typeof (_d = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "respondToReview", null);
__decorate([
    (0, common_1.Get)("dashboard/approve/:id"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_e = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "approveReview", null);
__decorate([
    (0, common_1.Get)("dashboard/reject/:id"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_f = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "rejectReview", null);
__decorate([
    (0, common_1.Get)("dashboard/delete/:id"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_g = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _g : Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "deleteReview", null);
ReviewsController = __decorate([
    (0, common_1.Controller)("reviews"),
    __metadata("design:paramtypes", [typeof (_a = typeof reviews_service_1.ReviewsService !== "undefined" && reviews_service_1.ReviewsService) === "function" ? _a : Object, typeof (_b = typeof tours_service_1.ToursService !== "undefined" && tours_service_1.ToursService) === "function" ? _b : Object])
], ReviewsController);
exports.ReviewsController = ReviewsController;


/***/ }),

/***/ "./src/modules/reviews/reviews.module.ts":
/*!***********************************************!*\
  !*** ./src/modules/reviews/reviews.module.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReviewsModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const reviews_service_1 = __webpack_require__(/*! ./reviews.service */ "./src/modules/reviews/reviews.service.ts");
const tours_module_1 = __webpack_require__(/*! ../tours/tours.module */ "./src/modules/tours/tours.module.ts");
const reviews_controller_1 = __webpack_require__(/*! ./reviews.controller */ "./src/modules/reviews/reviews.controller.ts");
const review_schema_1 = __webpack_require__(/*! ./schemas/review.schema */ "./src/modules/reviews/schemas/review.schema.ts");
let ReviewsModule = class ReviewsModule {
};
ReviewsModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: review_schema_1.Review.name, schema: review_schema_1.ReviewSchema }]),
            tours_module_1.ToursModule
        ],
        controllers: [reviews_controller_1.ReviewsController],
        providers: [reviews_service_1.ReviewsService],
        exports: [reviews_service_1.ReviewsService],
    })
], ReviewsModule);
exports.ReviewsModule = ReviewsModule;


/***/ }),

/***/ "./src/modules/reviews/reviews.service.ts":
/*!************************************************!*\
  !*** ./src/modules/reviews/reviews.service.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReviewsService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const review_schema_1 = __webpack_require__(/*! ./schemas/review.schema */ "./src/modules/reviews/schemas/review.schema.ts");
let ReviewsService = class ReviewsService {
    constructor(reviewModel) {
        this.reviewModel = reviewModel;
    }
    async create(createReviewDto) {
        const newReview = new this.reviewModel(createReviewDto);
        return newReview.save();
    }
    async findAll(query) {
        const filter = {};
        if (query && query.search) {
            filter.$text = { $search: query.search };
        }
        if (query && query.status) {
            filter.status = query.status;
        }
        if (query && query.tour) {
            filter.tour = query.tour;
        }
        return this.reviewModel.find(filter).sort({ createdAt: -1 }).populate("tour", "title slug").exec();
    }
    async findApproved(limit) {
        const query = this.reviewModel
            .find({ status: review_schema_1.ReviewStatus.APPROVED })
            .sort({ createdAt: -1 })
            .populate("tour", "title slug");
        if (limit) {
            query.limit(limit);
        }
        return query.exec();
    }
    async findOne(id) {
        const review = await this.reviewModel.findById(id).populate("tour", "title slug").exec();
        if (!review) {
            throw new common_1.NotFoundException(`Review with ID ${id} not found`);
        }
        return review;
    }
    async update(id, updateReviewDto) {
        if (updateReviewDto.response) {
            updateReviewDto["responseDate"] = new Date();
        }
        const updatedReview = await this.reviewModel.findByIdAndUpdate(id, updateReviewDto, { new: true }).exec();
        if (!updatedReview) {
            throw new common_1.NotFoundException(`Review with ID ${id} not found`);
        }
        return updatedReview;
    }
    async remove(id) {
        const deletedReview = await this.reviewModel.findByIdAndDelete(id).exec();
        if (!deletedReview) {
            throw new common_1.NotFoundException(`Review with ID ${id} not found`);
        }
        return deletedReview;
    }
    async updateStatus(id, status) {
        const review = await this.reviewModel.findById(id).exec();
        if (!review) {
            throw new common_1.NotFoundException(`Review with ID ${id} not found`);
        }
        review.status = status;
        return review.save();
    }
};
ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(review_schema_1.Review.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], ReviewsService);
exports.ReviewsService = ReviewsService;


/***/ }),

/***/ "./src/modules/reviews/schemas/review.schema.ts":
/*!******************************************************!*\
  !*** ./src/modules/reviews/schemas/review.schema.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReviewSchema = exports.Review = exports.ReviewStatus = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const mongoose = __importStar(__webpack_require__(/*! mongoose */ "mongoose"));
var ReviewStatus;
(function (ReviewStatus) {
    ReviewStatus["PENDING"] = "pending";
    ReviewStatus["APPROVED"] = "approved";
    ReviewStatus["REJECTED"] = "rejected";
})(ReviewStatus = exports.ReviewStatus || (exports.ReviewStatus = {}));
let Review = class Review extends mongoose_2.Document {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Review.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Review.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Review.prototype, "country", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1, max: 5 }),
    __metadata("design:type", Number)
], Review.prototype, "rating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Review.prototype, "comment", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Review.prototype, "avatar", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ReviewStatus, default: ReviewStatus.PENDING }),
    __metadata("design:type", String)
], Review.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: "Tour" }),
    __metadata("design:type", Object)
], Review.prototype, "tour", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Review.prototype, "response", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Review.prototype, "responseDate", void 0);
Review = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Review);
exports.Review = Review;
exports.ReviewSchema = mongoose_1.SchemaFactory.createForClass(Review);
exports.ReviewSchema.index({ name: "text", email: "text", comment: "text", country: "text" });


/***/ }),

/***/ "./src/modules/subscribers/schemas/subscriber.schema.ts":
/*!**************************************************************!*\
  !*** ./src/modules/subscribers/schemas/subscriber.schema.ts ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SubscriberSchema = exports.Subscriber = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
let Subscriber = class Subscriber extends mongoose_2.Document {
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Subscriber.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Subscriber.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Subscriber.prototype, "phoneNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Subscriber.prototype, "isActive", void 0);
Subscriber = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Subscriber);
exports.Subscriber = Subscriber;
exports.SubscriberSchema = mongoose_1.SchemaFactory.createForClass(Subscriber);
exports.SubscriberSchema.index({ name: "text", email: "text", phoneNumber: "text" });


/***/ }),

/***/ "./src/modules/subscribers/subscribers.controller.ts":
/*!***********************************************************!*\
  !*** ./src/modules/subscribers/subscribers.controller.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SubscribersController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const express_1 = __webpack_require__(/*! express */ "express");
const subscribers_service_1 = __webpack_require__(/*! ./subscribers.service */ "./src/modules/subscribers/subscribers.service.ts");
const session_auth_guard_1 = __webpack_require__(/*! ../auth/guards/session-auth.guard */ "./src/modules/auth/guards/session-auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../auth/guards/roles.guard */ "./src/modules/auth/guards/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./src/modules/auth/decorators/roles.decorator.ts");
const user_schema_1 = __webpack_require__(/*! ../users/schemas/user.schema */ "./src/modules/users/schemas/user.schema.ts");
let SubscribersController = class SubscribersController {
    constructor(subscribersService) {
        this.subscribersService = subscribersService;
    }
    async createSubscriber(createSubscriberDto, res, req) {
        console.log("SubscribersController: Received subscription request for email:", createSubscriberDto.email);
        try {
            await this.subscribersService.create(createSubscriberDto);
            req.flash("success_msg", "You've successfully subscribed to our newsletter!");
            console.log("SubscribersController: Subscriber created/reactivated, redirecting with success.");
            return res.redirect("/");
        }
        catch (error) {
            console.error("SubscribersController: Error creating subscriber:", error.message);
            req.flash("error_msg", error.message || "Failed to subscribe. Please try again.");
            return res.redirect("/");
        }
    }
    async getSubscribers(query, req) {
        const subscribers = await this.subscribersService.findAll(query);
        return {
            title: "Subscribers - Dashboard",
            subscribers,
            user: req.user,
            query,
            layout: "layouts/dashboard",
        };
    }
    async getEditSubscriberPage(id, req) {
        const subscriber = await this.subscribersService.findOne(id);
        return {
            title: "Edit Subscriber - Dashboard",
            subscriber,
            user: req.user,
            layout: "layouts/dashboard",
        };
    }
    async updateSubscriber(id, updateSubscriberDto, req, res) {
        try {
            await this.subscribersService.update(id, updateSubscriberDto);
            req.flash("success_msg", "Subscriber updated successfully");
            return res.redirect("/subscribers/dashboard");
        }
        catch (error) {
            req.flash("error_msg", error.message);
            return res.redirect(`/subscribers/dashboard/edit/${id}`);
        }
    }
    async toggleSubscriberStatus(id, req, res) {
        try {
            await this.subscribersService.toggleActive(id);
            req.flash("success_msg", "Subscriber status toggled successfully");
            return res.redirect("/subscribers/dashboard");
        }
        catch (error) {
            req.flash("error_msg", error.message);
            return res.redirect("/subscribers/dashboard");
        }
    }
    async deleteSubscriber(id, req, res) {
        try {
            await this.subscribersService.remove(id);
            req.flash("success_msg", "Subscriber deleted successfully");
            return res.redirect("/subscribers/dashboard");
        }
        catch (error) {
            req.flash("error_msg", error.message);
            return res.redirect("/subscribers/dashboard");
        }
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", Promise)
], SubscribersController.prototype, "createSubscriber", null);
__decorate([
    (0, common_1.Get)("dashboard"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, common_1.Render)("dashboard/subscribers/index"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SubscribersController.prototype, "getSubscribers", null);
__decorate([
    (0, common_1.Get)("dashboard/edit/:id"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, common_1.Render)("dashboard/subscribers/edit"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SubscribersController.prototype, "getEditSubscriberPage", null);
__decorate([
    (0, common_1.Post)("dashboard/edit/:id"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, typeof (_c = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], SubscribersController.prototype, "updateSubscriber", null);
__decorate([
    (0, common_1.Get)("dashboard/toggle/:id"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_d = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], SubscribersController.prototype, "toggleSubscriberStatus", null);
__decorate([
    (0, common_1.Get)("dashboard/delete/:id"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_e = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], SubscribersController.prototype, "deleteSubscriber", null);
SubscribersController = __decorate([
    (0, common_1.Controller)("subscribers"),
    __metadata("design:paramtypes", [typeof (_a = typeof subscribers_service_1.SubscribersService !== "undefined" && subscribers_service_1.SubscribersService) === "function" ? _a : Object])
], SubscribersController);
exports.SubscribersController = SubscribersController;


/***/ }),

/***/ "./src/modules/subscribers/subscribers.module.ts":
/*!*******************************************************!*\
  !*** ./src/modules/subscribers/subscribers.module.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SubscribersModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const subscribers_service_1 = __webpack_require__(/*! ./subscribers.service */ "./src/modules/subscribers/subscribers.service.ts");
const subscribers_controller_1 = __webpack_require__(/*! ./subscribers.controller */ "./src/modules/subscribers/subscribers.controller.ts");
const subscriber_schema_1 = __webpack_require__(/*! ./schemas/subscriber.schema */ "./src/modules/subscribers/schemas/subscriber.schema.ts");
const mail_module_1 = __webpack_require__(/*! ../mail/mail.module */ "./src/modules/mail/mail.module.ts");
let SubscribersModule = class SubscribersModule {
};
SubscribersModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: subscriber_schema_1.Subscriber.name, schema: subscriber_schema_1.SubscriberSchema }]), mail_module_1.MailModule],
        controllers: [subscribers_controller_1.SubscribersController],
        providers: [subscribers_service_1.SubscribersService],
        exports: [subscribers_service_1.SubscribersService],
    })
], SubscribersModule);
exports.SubscribersModule = SubscribersModule;


/***/ }),

/***/ "./src/modules/subscribers/subscribers.service.ts":
/*!********************************************************!*\
  !*** ./src/modules/subscribers/subscribers.service.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SubscribersService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const mongoose_2 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const subscriber_schema_1 = __webpack_require__(/*! ./schemas/subscriber.schema */ "./src/modules/subscribers/schemas/subscriber.schema.ts");
const mail_service_1 = __webpack_require__(/*! ../mail/mail.service */ "./src/modules/mail/mail.service.ts");
let SubscribersService = class SubscribersService {
    constructor(subscriberModel, mailService) {
        this.subscriberModel = subscriberModel;
        this.mailService = mailService;
    }
    async create(createSubscriberDto) {
        console.log("SubscribersService: Attempting to create/reactivate subscriber:", createSubscriberDto.email);
        const existingSubscriber = await this.subscriberModel.findOne({ email: createSubscriberDto.email });
        if (existingSubscriber) {
            if (existingSubscriber.isActive) {
                console.log("SubscribersService: Email already subscribed and active.");
                throw new common_1.ConflictException("Email is already subscribed to our newsletter");
            }
            else {
                console.log("SubscribersService: Reactivating inactive subscriber.");
                existingSubscriber.isActive = true;
                if (createSubscriberDto.name)
                    existingSubscriber.name = createSubscriberDto.name;
                if (createSubscriberDto.phoneNumber)
                    existingSubscriber.phoneNumber = createSubscriberDto.phoneNumber;
                const reactivatedSubscriber = await existingSubscriber.save();
                await this.mailService.sendSubscriptionConfirmation(reactivatedSubscriber);
                console.log("SubscribersService: Reactivated subscriber and sent confirmation email.");
                return reactivatedSubscriber;
            }
        }
        console.log("SubscribersService: Creating new subscriber.");
        const newSubscriber = new this.subscriberModel(createSubscriberDto);
        const savedSubscriber = await newSubscriber.save();
        await this.mailService.sendSubscriptionConfirmation(savedSubscriber);
        await this.mailService.sendNewSubscriberNotification(savedSubscriber);
        console.log("SubscribersService: New subscriber created and emails sent.");
        return savedSubscriber;
    }
    async findAll(query) {
        const filter = {};
        if (query && query.search) {
            filter.$text = { $search: query.search };
        }
        if (query && query.isActive !== undefined) {
            filter.isActive = query.isActive === "true";
        }
        return this.subscriberModel.find(filter).sort({ createdAt: -1 }).exec();
    }
    async findOne(id) {
        const subscriber = await this.subscriberModel.findById(id).exec();
        if (!subscriber) {
            throw new common_1.NotFoundException(`Subscriber with ID ${id} not found`);
        }
        return subscriber;
    }
    async update(id, updateSubscriberDto) {
        const updatedSubscriber = await this.subscriberModel
            .findByIdAndUpdate(id, updateSubscriberDto, { new: true })
            .exec();
        if (!updatedSubscriber) {
            throw new common_1.NotFoundException(`Subscriber with ID ${id} not found`);
        }
        return updatedSubscriber;
    }
    async remove(id) {
        const deletedSubscriber = await this.subscriberModel.findByIdAndDelete(id).exec();
        if (!deletedSubscriber) {
            throw new common_1.NotFoundException(`Subscriber with ID ${id} not found`);
        }
        return deletedSubscriber;
    }
    async toggleActive(id) {
        const subscriber = await this.subscriberModel.findById(id).exec();
        if (!subscriber) {
            throw new common_1.NotFoundException(`Subscriber with ID ${id} not found`);
        }
        subscriber.isActive = !subscriber.isActive;
        return subscriber.save();
    }
};
SubscribersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(subscriber_schema_1.Subscriber.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_1.Model !== "undefined" && mongoose_1.Model) === "function" ? _a : Object, typeof (_b = typeof mail_service_1.MailService !== "undefined" && mail_service_1.MailService) === "function" ? _b : Object])
], SubscribersService);
exports.SubscribersService = SubscribersService;


/***/ }),

/***/ "./src/modules/tours/dto/create-tour.dto.ts":
/*!**************************************************!*\
  !*** ./src/modules/tours/dto/create-tour.dto.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateTourDto = exports.ItineraryItemDto = void 0;
const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const tour_schema_1 = __webpack_require__(/*! ../schemas/tour.schema */ "./src/modules/tours/schemas/tour.schema.ts");
class ItineraryItemDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Type)(() => String),
    __metadata("design:type", String)
], ItineraryItemDto.prototype, "day", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ItineraryItemDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ItineraryItemDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ItineraryItemDto.prototype, "accommodation", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(['Lunch & Dinner', 'Breakfast, Lunch & Dinner', 'Breakfast & Lunch', 'Breakfast Only', '']),
    __metadata("design:type", String)
], ItineraryItemDto.prototype, "meals", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ItineraryItemDto.prototype, "activities", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ItineraryItemDto.prototype, "coverImage", void 0);
exports.ItineraryItemDto = ItineraryItemDto;
class InclusionItemDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InclusionItemDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InclusionItemDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], InclusionItemDto.prototype, "isIncluded", void 0);
class CreateTourDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "overview", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "summary", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "highlights", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "coverImage", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateTourDto.prototype, "days", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_transformer_1.Type)(() => Number),
    __metadata("design:type", Number)
], CreateTourDto.prototype, "price", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTourDto.prototype, "discountPrice", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateTourDto.prototype, "groupSize", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateTourDto.prototype, "galleryImages", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(tour_schema_1.TourStatus),
    __metadata("design:type", typeof (_a = typeof tour_schema_1.TourStatus !== "undefined" && tour_schema_1.TourStatus) === "function" ? _a : Object)
], CreateTourDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTourDto.prototype, "isFeatured", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "country", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "category", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "priceIncludes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "priceExcludes", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ItineraryItemDto),
    __metadata("design:type", Array)
], CreateTourDto.prototype, "itineraries", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => InclusionItemDto),
    __metadata("design:type", Array)
], CreateTourDto.prototype, "inclusions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "seoTitle", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "seoDescription", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "seoKeywords", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "seoCanonicalUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateTourDto.prototype, "seoOgImage", void 0);
exports.CreateTourDto = CreateTourDto;


/***/ }),

/***/ "./src/modules/tours/dto/update-tour.dto.ts":
/*!**************************************************!*\
  !*** ./src/modules/tours/dto/update-tour.dto.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UpdateTourDto = void 0;
const mapped_types_1 = __webpack_require__(/*! @nestjs/mapped-types */ "@nestjs/mapped-types");
const create_tour_dto_1 = __webpack_require__(/*! ./create-tour.dto */ "./src/modules/tours/dto/create-tour.dto.ts");
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class UpdateTourDto extends (0, mapped_types_1.PartialType)(create_tour_dto_1.CreateTourDto) {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateTourDto.prototype, "removedGalleryImages", void 0);
exports.UpdateTourDto = UpdateTourDto;


/***/ }),

/***/ "./src/modules/tours/schemas/tour.schema.ts":
/*!**************************************************!*\
  !*** ./src/modules/tours/schemas/tour.schema.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TourSchema = exports.Tour = exports.TourStatus = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const mongoose = __importStar(__webpack_require__(/*! mongoose */ "mongoose"));
var TourStatus;
(function (TourStatus) {
    TourStatus["DRAFT"] = "draft";
    TourStatus["PUBLISHED"] = "published";
    TourStatus["ARCHIVED"] = "archived";
})(TourStatus = exports.TourStatus || (exports.TourStatus = {}));
let Tour = class Tour extends mongoose_2.Document {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Tour.prototype, "title", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Tour.prototype, "slug", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Tour.prototype, "overview", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Tour.prototype, "highlights", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Tour.prototype, "summary", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Tour.prototype, "coverImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Tour.prototype, "days", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Tour.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Tour.prototype, "discountPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Tour.prototype, "groupSize", void 0);
__decorate([
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], Tour.prototype, "galleryImages", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: TourStatus, default: TourStatus.DRAFT }),
    __metadata("design:type", String)
], Tour.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Tour.prototype, "isFeatured", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Country" }] }),
    __metadata("design:type", Array)
], Tour.prototype, "countries", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }] }),
    __metadata("design:type", Array)
], Tour.prototype, "categories", void 0);
__decorate([
    (0, mongoose_1.Prop)([
        {
            day: { type: String, required: true },
            title: { type: String, required: true },
            description: { type: String, required: true },
            accommodation: { type: String },
            meals: { type: String },
            activities: [String],
            image: { type: String },
        },
    ]),
    __metadata("design:type", Array)
], Tour.prototype, "itineraries", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Tour.prototype, "priceIncludes", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Tour.prototype, "priceExcludes", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Tour.prototype, "seoTitle", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Tour.prototype, "seoDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Tour.prototype, "seoKeywords", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Tour.prototype, "seoCanonicalUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Tour.prototype, "seoOgImage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: "User" }),
    __metadata("design:type", Object)
], Tour.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose.Schema.Types.ObjectId, ref: "User" }),
    __metadata("design:type", Object)
], Tour.prototype, "updatedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 0 }),
    __metadata("design:type", Number)
], Tour.prototype, "views", void 0);
Tour = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Tour);
exports.Tour = Tour;
exports.TourSchema = mongoose_1.SchemaFactory.createForClass(Tour);
exports.TourSchema.index({
    title: "text",
    overview: "text",
    description: "text",
    summary: "text",
    seoKeywords: "text",
});


/***/ }),

/***/ "./src/modules/tours/tours.controller.ts":
/*!***********************************************!*\
  !*** ./src/modules/tours/tours.controller.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ToursController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const platform_express_1 = __webpack_require__(/*! @nestjs/platform-express */ "@nestjs/platform-express");
const express_1 = __webpack_require__(/*! express */ "express");
const tours_service_1 = __webpack_require__(/*! ./tours.service */ "./src/modules/tours/tours.service.ts");
const create_tour_dto_1 = __webpack_require__(/*! ./dto/create-tour.dto */ "./src/modules/tours/dto/create-tour.dto.ts");
const update_tour_dto_1 = __webpack_require__(/*! ./dto/update-tour.dto */ "./src/modules/tours/dto/update-tour.dto.ts");
const session_auth_guard_1 = __webpack_require__(/*! ../auth/guards/session-auth.guard */ "./src/modules/auth/guards/session-auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../auth/guards/roles.guard */ "./src/modules/auth/guards/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./src/modules/auth/decorators/roles.decorator.ts");
const user_schema_1 = __webpack_require__(/*! ../users/schemas/user.schema */ "./src/modules/users/schemas/user.schema.ts");
const tour_schema_1 = __webpack_require__(/*! ./schemas/tour.schema */ "./src/modules/tours/schemas/tour.schema.ts");
const multer_config_1 = __webpack_require__(/*! ../../config/multer.config */ "./src/config/multer.config.ts");
const countries_service_1 = __webpack_require__(/*! ../countries/countries.service */ "./src/modules/countries/countries.service.ts");
const categories_service_1 = __webpack_require__(/*! ../categories/categories.service */ "./src/modules/categories/categories.service.ts");
let ToursController = class ToursController {
    constructor(toursService, countriesService, categoriesService) {
        this.toursService = toursService;
        this.countriesService = countriesService;
        this.categoriesService = categoriesService;
    }
    async getAllTours(page = '1', limit = '10', search = '', countryId = 'all', categoryId = 'all', status = tour_schema_1.TourStatus.PUBLISHED) {
        const { tours, totalDocs, limit: perPageLimit, totalPages, page: currentPage, hasNextPage, hasPrevPage, nextPage, prevPage, } = await this.toursService.findAll({
            page,
            limit,
            search,
            country: countryId === 'all' ? undefined : countryId,
            category: categoryId === 'all' ? undefined : categoryId,
            status: status,
        });
        const countries = await this.countriesService.findAll({});
        const categories = await this.categoriesService.findAll({});
        return {
            title: "Safari Tours - Roads of Adventure Safaris",
            tours,
            countries: countries.data,
            categories: categories.data,
            query: { page: currentPage.toString(), limit: perPageLimit.toString(), search, countryId, categoryId, status },
            pagination: {
                totalDocs,
                totalPages,
                currentPage,
                hasNextPage,
                hasPrevPage,
                nextPage,
                prevPage,
            },
            layout: "layouts/public",
        };
    }
    async getTour(slug) {
        var _a;
        const tour = await this.toursService.findBySlug(slug);
        const relatedToursResult = await this.toursService.findAll({
            country: tour.countries.length > 0 ? (_a = tour.countries[0]) === null || _a === void 0 ? void 0 : _a._id.toString() : undefined,
            status: tour_schema_1.TourStatus.PUBLISHED,
            limit: '4',
        });
        const filteredRelatedTours = relatedToursResult.tours.filter((relatedTour) => relatedTour._id.toString() !== tour._id.toString());
        return {
            title: `${tour.title} - Roads of Adventure Safaris`,
            tour,
            relatedTours: filteredRelatedTours.slice(0, 3),
            layout: "layouts/public",
            seo: {
                title: tour.seoTitle || `${tour.title} - Roads of Adventure Safaris`,
                description: tour.seoDescription || tour.overview,
                keywords: tour.seoKeywords,
                canonicalUrl: tour.seoCanonicalUrl,
                ogImage: tour.seoOgImage || tour.coverImage,
            },
        };
    }
    async getTours(page = '1', limit = '10', search = '', countryId = 'all', categoryId = 'all', status = 'all', req) {
        const filterOptions = {
            page,
            limit,
            search,
            country: countryId === 'all' ? undefined : countryId,
            category: categoryId === 'all' ? undefined : categoryId,
            status: status === 'all' ? undefined : status,
        };
        if (req.user.role === user_schema_1.UserRole.AGENT) {
            filterOptions.createdBy = req.user.id;
        }
        const { tours, totalDocs, limit: perPageLimit, totalPages, page: currentPage, hasNextPage, hasPrevPage, nextPage, prevPage, } = await this.toursService.findAll(filterOptions);
        const countries = await this.countriesService.findAll({});
        const categories = await this.categoriesService.findAll({});
        return {
            title: "Tours - Dashboard",
            tours,
            countries: countries.data,
            categories: categories.data,
            user: req.user,
            query: { page: currentPage.toString(), limit: perPageLimit.toString(), search, countryId, categoryId, status },
            pagination: {
                totalDocs,
                totalPages,
                currentPage,
                hasNextPage,
                hasPrevPage,
                nextPage,
                prevPage,
            },
            layout: "layouts/dashboard",
            tourStatuses: Object.values(tour_schema_1.TourStatus),
        };
    }
    async getAddTourPage(req) {
        const countries = await this.countriesService.findAll({});
        const categories = await this.categoriesService.findAll({});
        return {
            title: "Add Tour - Dashboard",
            countries: countries.data,
            categories: categories.data,
            user: req.user,
            layout: "layouts/dashboard",
        };
    }
    async addTour(createTourDto, uploadedFiles, req, res) {
        try {
            const newCoverImageFile = uploadedFiles.coverImage ? uploadedFiles.coverImage[0] : null;
            const newGalleryImageFiles = uploadedFiles.galleryImages || [];
            if (newCoverImageFile) {
                createTourDto.coverImage = `/uploads/tours/${newCoverImageFile.filename}`;
            }
            else if (createTourDto.coverImage === '') {
                createTourDto.coverImage = null;
            }
            if (newGalleryImageFiles.length > 0) {
                createTourDto.galleryImages = newGalleryImageFiles.map((file) => `/uploads/tours/${file.filename}`);
            }
            else if (!createTourDto.galleryImages) {
                createTourDto.galleryImages = [];
            }
            const tourDataToSave = Object.assign(Object.assign({}, createTourDto), { countries: createTourDto.country ? [createTourDto.country] : [], categories: createTourDto.category ? [createTourDto.category] : [] });
            delete tourDataToSave.country;
            delete tourDataToSave.category;
            await this.toursService.create(tourDataToSave, req.user.id);
            req.flash("success_msg", "Tour added successfully");
            return res.redirect("/tours/dashboard/tours");
        }
        catch (error) {
            console.error('Error adding tour:', error);
            let flashMessage = "Failed to add tour.";
            if (error instanceof common_1.HttpException) {
                const response = error.getResponse();
                if (typeof response === 'object' && response !== null && 'message' in response) {
                    if (Array.isArray(response.message)) {
                        flashMessage = response.message.join(', ');
                    }
                    else {
                        flashMessage = response.message;
                    }
                }
                else if (typeof response === 'string') {
                    flashMessage = response;
                }
                else {
                    flashMessage = error.message || "An unknown error occurred.";
                }
            }
            else if (error.message) {
                flashMessage = error.message;
            }
            req.flash("error_msg", flashMessage);
            req.flash('oldInput', createTourDto);
            return res.redirect("/tours/dashboard/tours/add");
        }
    }
    async getEditTourPage(id, req, res) {
        try {
            const tour = await this.toursService.findOne(id);
            const countries = await this.countriesService.findAll({});
            const categories = await this.categoriesService.findAll({});
            if (req.user.role === user_schema_1.UserRole.AGENT && tour.createdBy.toString() !== req.user.id) {
                req.flash("error_msg", "You are not authorized to edit this tour");
                return res.redirect("/tours/dashboard/tours");
            }
            return {
                title: "Edit Tour - Dashboard",
                tour,
                countries: countries.data,
                categories: categories.data,
                user: req.user,
                layout: "layouts/dashboard",
                messages: req.flash(),
            };
        }
        catch (error) {
            console.error('Error fetching tour for edit:', error);
            req.flash("error_msg", error.message || "Failed to load tour for editing.");
            return res.redirect("/tours/dashboard/tours");
        }
    }
    async updateTour(id, updateTourDto, uploadedFiles, req, res) {
        try {
            const tour = await this.toursService.findOne(id);
            if (!tour) {
                req.flash("error_msg", "Tour not found.");
                return res.redirect("/dashboard/tours");
            }
            if (req.user.role === user_schema_1.UserRole.AGENT && tour.createdBy.toString() !== req.user.id) {
                req.flash("error_msg", "You are not authorized to edit this tour");
                return res.redirect("/dashboard/tours");
            }
            const newCoverImageFile = uploadedFiles.coverImage ? uploadedFiles.coverImage[0] : null;
            const newGalleryImageFiles = uploadedFiles.galleryImages || [];
            if (newCoverImageFile) {
                updateTourDto.coverImage = `/uploads/tours/${newCoverImageFile.filename}`;
            }
            else if (updateTourDto.coverImage === '') {
                updateTourDto.coverImage = null;
            }
            let currentGalleryImages = tour.galleryImages || [];
            if (updateTourDto.removedGalleryImages && Array.isArray(updateTourDto.removedGalleryImages)) {
                currentGalleryImages = currentGalleryImages.filter(img => !updateTourDto.removedGalleryImages.includes(img));
            }
            const uploadedGalleryPaths = newGalleryImageFiles.map((file) => `/uploads/tours/${file.filename}`);
            updateTourDto.galleryImages = [...currentGalleryImages, ...uploadedGalleryPaths];
            const tourDataToUpdate = Object.assign(Object.assign({}, updateTourDto), { countries: updateTourDto.country ? (Array.isArray(updateTourDto.country) ? updateTourDto.country : [updateTourDto.country]) : [], categories: updateTourDto.category ? (Array.isArray(updateTourDto.category) ? updateTourDto.category : [updateTourDto.category]) : [] });
            delete tourDataToUpdate.country;
            delete tourDataToUpdate.category;
            await this.toursService.update(id, tourDataToUpdate, req.user.id);
            req.flash("success_msg", "Tour updated successfully");
            return res.redirect("/tours/dashboard/tours");
        }
        catch (error) {
            console.error('Error updating tour:', error);
            req.flash("error_msg", error.message || "Failed to update tour.");
            return res.redirect(`/dashboard/tours/edit/${id}`);
        }
    }
    async deleteTour(id, req, res) {
        try {
            const tour = await this.toursService.findOne(id);
            if (req.user.role === user_schema_1.UserRole.AGENT && tour.createdBy.toString() !== req.user.id) {
                req.flash("error_msg", "You are not authorized to delete this tour");
                return res.redirect("/tours/dashboard/tours");
            }
            await this.toursService.remove(id);
            req.flash("success_msg", "Tour deleted successfully");
            return res.redirect("/tours/dashboard/tours");
        }
        catch (error) {
            console.error('Error deleting tour:', error);
            req.flash("error_msg", error.message || "Failed to delete tour.");
            return res.redirect("/tours/dashboard/tours");
        }
    }
    async updateTourStatus(id, status, req, res) {
        try {
            const tour = await this.toursService.findOne(id);
            if (req.user.role === user_schema_1.UserRole.AGENT && tour.createdBy.toString() !== req.user.id) {
                req.flash("error_msg", "You are not authorized to update this tour");
                return res.redirect("/tours/dashboard/tours");
            }
            await this.toursService.updateStatus(id, status, req.user.id);
            req.flash("success_msg", `Tour status updated to ${status}`);
            return res.redirect("/tours/dashboard/tours");
        }
        catch (error) {
            console.error('Error updating tour status:', error);
            req.flash("error_msg", error.message || "Failed to update tour status.");
            return res.redirect("/tours/dashboard/tours");
        }
    }
    async toggleFeatured(id, req, res) {
        try {
            await this.toursService.toggleFeatured(id, req.user.id);
            req.flash("success_msg", "Tour featured status toggled successfully");
            return res.redirect("/tours/dashboard/tours");
        }
        catch (error) {
            console.error('Error toggling featured status:', error);
            req.flash("error_msg", error.message || "Failed to toggle featured status.");
            return res.redirect("/tours/dashboard/tours");
        }
    }
};
__decorate([
    (0, common_1.Get)(),
    (0, common_1.Render)("public/tours/index"),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('countryId')),
    __param(4, (0, common_1.Query)('categoryId')),
    __param(5, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, typeof (_d = typeof tour_schema_1.TourStatus !== "undefined" && tour_schema_1.TourStatus) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], ToursController.prototype, "getAllTours", null);
__decorate([
    (0, common_1.Get)(":slug"),
    (0, common_1.Render)("public/tours/show"),
    __param(0, (0, common_1.Param)("slug")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ToursController.prototype, "getTour", null);
__decorate([
    (0, common_1.Get)("dashboard/tours"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard),
    (0, common_1.Render)("dashboard/tours/index"),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('countryId')),
    __param(4, (0, common_1.Query)('categoryId')),
    __param(5, (0, common_1.Query)('status')),
    __param(6, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], ToursController.prototype, "getTours", null);
__decorate([
    (0, common_1.Get)("dashboard/tours/add"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard),
    (0, common_1.Render)("dashboard/tours/add"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ToursController.prototype, "getAddTourPage", null);
__decorate([
    (0, common_1.Post)("dashboard/tours/add"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'coverImage', maxCount: 1 },
        { name: 'galleryImages', maxCount: 10 },
    ], (0, multer_config_1.getMulterConfig)('tours'))),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof create_tour_dto_1.CreateTourDto !== "undefined" && create_tour_dto_1.CreateTourDto) === "function" ? _f : Object, Object, Object, typeof (_g = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _g : Object]),
    __metadata("design:returntype", Promise)
], ToursController.prototype, "addTour", null);
__decorate([
    (0, common_1.Get)("dashboard/tours/edit/:id"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard),
    (0, common_1.Render)("dashboard/tours/edit"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_h = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], ToursController.prototype, "getEditTourPage", null);
__decorate([
    (0, common_1.Patch)("dashboard/tours/edit/:id"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'coverImage', maxCount: 1 },
        { name: 'galleryImages', maxCount: 10 },
    ], (0, multer_config_1.getMulterConfig)('tours'))),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __param(3, (0, common_1.Req)()),
    __param(4, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_j = typeof update_tour_dto_1.UpdateTourDto !== "undefined" && update_tour_dto_1.UpdateTourDto) === "function" ? _j : Object, Object, Object, typeof (_k = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _k : Object]),
    __metadata("design:returntype", Promise)
], ToursController.prototype, "updateTour", null);
__decorate([
    (0, common_1.Delete)("dashboard/tours/:id"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_l = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _l : Object]),
    __metadata("design:returntype", Promise)
], ToursController.prototype, "deleteTour", null);
__decorate([
    (0, common_1.Patch)("dashboard/tours/:id/status/:status"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Param)("status")),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_m = typeof tour_schema_1.TourStatus !== "undefined" && tour_schema_1.TourStatus) === "function" ? _m : Object, Object, typeof (_o = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _o : Object]),
    __metadata("design:returntype", Promise)
], ToursController.prototype, "updateTourStatus", null);
__decorate([
    (0, common_1.Patch)("dashboard/tours/:id/featured"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_p = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _p : Object]),
    __metadata("design:returntype", Promise)
], ToursController.prototype, "toggleFeatured", null);
ToursController = __decorate([
    (0, common_1.Controller)("tours"),
    __metadata("design:paramtypes", [typeof (_a = typeof tours_service_1.ToursService !== "undefined" && tours_service_1.ToursService) === "function" ? _a : Object, typeof (_b = typeof countries_service_1.CountriesService !== "undefined" && countries_service_1.CountriesService) === "function" ? _b : Object, typeof (_c = typeof categories_service_1.CategoriesService !== "undefined" && categories_service_1.CategoriesService) === "function" ? _c : Object])
], ToursController);
exports.ToursController = ToursController;


/***/ }),

/***/ "./src/modules/tours/tours.module.ts":
/*!*******************************************!*\
  !*** ./src/modules/tours/tours.module.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ToursModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const tours_service_1 = __webpack_require__(/*! ./tours.service */ "./src/modules/tours/tours.service.ts");
const tours_controller_1 = __webpack_require__(/*! ./tours.controller */ "./src/modules/tours/tours.controller.ts");
const tour_schema_1 = __webpack_require__(/*! ./schemas/tour.schema */ "./src/modules/tours/schemas/tour.schema.ts");
const countries_module_1 = __webpack_require__(/*! ../countries/countries.module */ "./src/modules/countries/countries.module.ts");
const categories_module_1 = __webpack_require__(/*! ../categories/categories.module */ "./src/modules/categories/categories.module.ts");
let ToursModule = class ToursModule {
};
ToursModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: tour_schema_1.Tour.name, schema: tour_schema_1.TourSchema }]),
            (0, common_1.forwardRef)(() => countries_module_1.CountriesModule),
            (0, common_1.forwardRef)(() => categories_module_1.CategoriesModule),
        ],
        controllers: [tours_controller_1.ToursController],
        providers: [tours_service_1.ToursService],
        exports: [tours_service_1.ToursService],
    })
], ToursModule);
exports.ToursModule = ToursModule;


/***/ }),

/***/ "./src/modules/tours/tours.service.ts":
/*!********************************************!*\
  !*** ./src/modules/tours/tours.service.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ToursService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const tour_schema_1 = __webpack_require__(/*! ./schemas/tour.schema */ "./src/modules/tours/schemas/tour.schema.ts");
const slugify_1 = __importDefault(__webpack_require__(/*! slugify */ "slugify"));
let ToursService = class ToursService {
    constructor(tourModel) {
        this.tourModel = tourModel;
    }
    async create(createTourDto, userId) {
        const generatedSlug = (0, slugify_1.default)(createTourDto.title, { lower: true, strict: true });
        const existingTour = await this.tourModel.findOne({
            $or: [
                { title: createTourDto.title },
                { slug: generatedSlug }
            ],
        });
        if (existingTour) {
            throw new common_1.ConflictException("Tour with this title or slug already exists.");
        }
        const newTour = new this.tourModel(Object.assign(Object.assign({}, createTourDto), { slug: generatedSlug, createdBy: userId, updatedBy: userId }));
        return newTour.save();
    }
    async findAll(options) {
        const filter = {};
        const page = parseInt((options === null || options === void 0 ? void 0 : options.page) || '1', 10);
        const limit = parseInt((options === null || options === void 0 ? void 0 : options.limit) || '10', 10);
        const skip = (page - 1) * limit;
        if (options && options.search) {
            filter.$text = { $search: options.search };
        }
        if (options && options.status) {
            filter.status = options.status;
        }
        if (options && options.country && options.country !== 'all') {
            filter.countries = options.country;
        }
        if (options && options.category && options.category !== 'all') {
            filter.categories = options.category;
        }
        if (options && options.createdBy) {
            filter.createdBy = options.createdBy;
        }
        if (options && options.featured) {
            filter.isFeatured = options.featured === "true";
        }
        const totalDocs = await this.tourModel.countDocuments(filter).exec();
        const tours = await this.tourModel
            .find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("countries", "name slug")
            .populate("categories", "name slug")
            .populate("createdBy", "name email")
            .exec();
        const totalPages = Math.ceil(totalDocs / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        const nextPage = hasNextPage ? page + 1 : null;
        const prevPage = hasPrevPage ? page - 1 : null;
        return {
            tours,
            totalDocs,
            limit,
            totalPages,
            page,
            hasNextPage,
            hasPrevPage,
            nextPage,
            prevPage,
        };
    }
    async findFeatured(limit) {
        const query = this.tourModel
            .find({ status: tour_schema_1.TourStatus.PUBLISHED })
            .sort({ days: -1 })
            .populate("countries", "name slug")
            .populate("categories", "name slug");
        if (limit) {
            query.limit(limit);
        }
        const foundTours = await query.exec();
        return foundTours;
    }
    async findOne(id) {
        const tour = await this.tourModel
            .findById(id)
            .populate("countries", "name slug")
            .populate("categories", "name slug")
            .populate("createdBy", "name email")
            .exec();
        if (!tour) {
            throw new common_1.NotFoundException(`Tour with ID ${id} not found`);
        }
        return tour;
    }
    async findBySlug(slug) {
        const tour = await this.tourModel
            .findOne({ slug, status: tour_schema_1.TourStatus.PUBLISHED })
            .populate("countries", "name slug")
            .populate("categories", "name slug")
            .populate("createdBy", "name email")
            .exec();
        if (!tour) {
            throw new common_1.NotFoundException(`Tour with slug ${slug} not found`);
        }
        return tour;
    }
    async findByCountry(countryId) {
        try {
            const objectId = new mongoose_2.Types.ObjectId(countryId);
            const tours = await this.tourModel
                .find({ countries: objectId })
                .populate('countries', 'name slug code')
                .populate('categories', 'name slug')
                .select('title slug overview summary coverImage days price discountPrice')
                .sort({ days: -1 })
                .exec();
            return tours;
        }
        catch (error) {
            throw new common_1.NotFoundException(`Could not retrieve tours for country ID: ${countryId}`);
        }
    }
    async findByCategory(categoryId, countryId, limit) {
        try {
            const queryConditions = {
                categories: new mongoose_2.Types.ObjectId(categoryId),
                status: tour_schema_1.TourStatus.PUBLISHED,
            };
            if (countryId) {
                queryConditions.countries = new mongoose_2.Types.ObjectId(countryId);
            }
            const query = this.tourModel
                .find(queryConditions)
                .sort({ days: -1 })
                .populate("countries", "name slug code")
                .populate("categories", "name slug")
                .select('title slug overview summary coverImage days price discountPrice');
            if (limit) {
                query.limit(limit);
            }
            return query.exec();
        }
        catch (error) {
            throw new common_1.NotFoundException(`Could not retrieve tours for category ID: ${categoryId}`);
        }
    }
    async update(id, updateTourDto, userId) {
        let slugToUpdate;
        if (updateTourDto.title) {
            slugToUpdate = (0, slugify_1.default)(updateTourDto.title, { lower: true, strict: true });
        }
        else {
            const existingTour = await this.tourModel.findById(id, { slug: 1 });
            if (!existingTour) {
                throw new common_1.NotFoundException(`Tour with ID ${id} not found.`);
            }
            slugToUpdate = existingTour.slug;
        }
        const existingTourWithSameSlug = await this.tourModel.findOne({
            slug: slugToUpdate,
            _id: { $ne: id },
        });
        if (existingTourWithSameSlug) {
            throw new common_1.ConflictException("Another tour with this slug already exists.");
        }
        const updatePayload = Object.assign(Object.assign({}, updateTourDto), { slug: slugToUpdate, updatedBy: userId });
        const updatedTour = await this.tourModel
            .findOneAndUpdate({ _id: id }, updatePayload, { new: true })
            .exec();
        if (!updatedTour) {
            throw new common_1.NotFoundException(`Tour with ID ${id} not found.`);
        }
        return updatedTour;
    }
    async remove(id) {
        const deletedTour = await this.tourModel.findByIdAndDelete(id).exec();
        if (!deletedTour) {
            throw new common_1.NotFoundException(`Tour with ID ${id} not found`);
        }
        return deletedTour;
    }
    async toggleFeatured(id, userId) {
        const tour = await this.tourModel.findById(id).exec();
        if (!tour) {
            throw new common_1.NotFoundException(`Tour with ID ${id} not found`);
        }
        tour.isFeatured = !tour.isFeatured;
        tour.updatedBy = new mongoose_2.Types.ObjectId(userId);
        return tour.save();
    }
    async updateStatus(id, status, userId) {
        const tour = await this.tourModel.findById(id).exec();
        if (!tour) {
            throw new common_1.NotFoundException(`Tour with ID ${id} not found`);
        }
        tour.status = status;
        tour.updatedBy = new mongoose_2.Types.ObjectId(userId);
        return tour.save();
    }
    async findPopular(limit = 4) {
        const query = this.tourModel
            .find({ status: tour_schema_1.TourStatus.PUBLISHED })
            .sort({ views: -1, createdAt: -1 })
            .limit(limit)
            .populate("countries", "name slug")
            .populate("categories", "name slug");
        const popularTours = await query.exec();
        return popularTours;
    }
    async incrementViews(slug) {
        return this.tourModel.findOneAndUpdate({ slug }, { $inc: { views: 1 } }, { new: true }).exec();
    }
};
ToursService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(tour_schema_1.Tour.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mongoose_2.Model !== "undefined" && mongoose_2.Model) === "function" ? _a : Object])
], ToursService);
exports.ToursService = ToursService;


/***/ }),

/***/ "./src/modules/users/dto/create-user.dto.ts":
/*!**************************************************!*\
  !*** ./src/modules/users/dto/create-user.dto.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateUserDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
const user_schema_1 = __webpack_require__(/*! ../schemas/user.schema */ "./src/modules/users/schemas/user.schema.ts");
class CreateUserDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], CreateUserDto.prototype, "confirmPassword", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(user_schema_1.UserRole),
    __metadata("design:type", typeof (_a = typeof user_schema_1.UserRole !== "undefined" && user_schema_1.UserRole) === "function" ? _a : Object)
], CreateUserDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "companyName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "companyWebsite", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "country", void 0);
exports.CreateUserDto = CreateUserDto;


/***/ }),

/***/ "./src/modules/users/dto/forgot-password.dto.ts":
/*!******************************************************!*\
  !*** ./src/modules/users/dto/forgot-password.dto.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ForgotPasswordDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class ForgotPasswordDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ForgotPasswordDto.prototype, "email", void 0);
exports.ForgotPasswordDto = ForgotPasswordDto;


/***/ }),

/***/ "./src/modules/users/dto/login-user.dto.ts":
/*!*************************************************!*\
  !*** ./src/modules/users/dto/login-user.dto.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoginUserDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class LoginUserDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginUserDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], LoginUserDto.prototype, "password", void 0);
exports.LoginUserDto = LoginUserDto;


/***/ }),

/***/ "./src/modules/users/dto/reset-password.dto.ts":
/*!*****************************************************!*\
  !*** ./src/modules/users/dto/reset-password.dto.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ResetPasswordDto = void 0;
const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");
class ResetPasswordDto {
}
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "token", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], ResetPasswordDto.prototype, "confirmPassword", void 0);
exports.ResetPasswordDto = ResetPasswordDto;


/***/ }),

/***/ "./src/modules/users/schemas/user.schema.ts":
/*!**************************************************!*\
  !*** ./src/modules/users/schemas/user.schema.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserSchema = exports.User = exports.UserStatus = exports.UserRole = void 0;
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const mongoose_2 = __webpack_require__(/*! mongoose */ "mongoose");
const bcrypt = __importStar(__webpack_require__(/*! bcrypt */ "bcrypt"));
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["AGENT"] = "agent";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["PENDING"] = "pending";
    UserStatus["ACTIVE"] = "active";
    UserStatus["INACTIVE"] = "inactive";
})(UserStatus = exports.UserStatus || (exports.UserStatus = {}));
let User = class User extends mongoose_2.Document {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: UserRole, default: UserRole.AGENT }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: UserStatus, default: UserStatus.PENDING }),
    __metadata("design:type", String)
], User.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "companyName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "companyWebsite", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "country", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "resetPasswordToken", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], User.prototype, "resetPasswordExpires", void 0);
User = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], User);
exports.User = User;
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
exports.UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};
exports.UserSchema.pre("save", async function (next) {
    if (!this.isModified("password"))
        return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});


/***/ }),

/***/ "./src/modules/users/users.controller.ts":
/*!***********************************************!*\
  !*** ./src/modules/users/users.controller.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const express_1 = __webpack_require__(/*! express */ "express");
const users_service_1 = __webpack_require__(/*! ./users.service */ "./src/modules/users/users.service.ts");
const session_auth_guard_1 = __webpack_require__(/*! ../auth/guards/session-auth.guard */ "./src/modules/auth/guards/session-auth.guard.ts");
const roles_guard_1 = __webpack_require__(/*! ../auth/guards/roles.guard */ "./src/modules/auth/guards/roles.guard.ts");
const roles_decorator_1 = __webpack_require__(/*! ../auth/decorators/roles.decorator */ "./src/modules/auth/decorators/roles.decorator.ts");
const user_schema_1 = __webpack_require__(/*! ./schemas/user.schema */ "./src/modules/users/schemas/user.schema.ts");
const user_ownership_guard_1 = __webpack_require__(/*! ../auth/guards/user-ownership.guard */ "./src/modules/auth/guards/user-ownership.guard.ts");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async getAgents(query, req) {
        const agents = await this.usersService.findAllAgents();
        return {
            title: "Agents - Dashboard",
            agents,
            user: req.user,
            layout: "layouts/dashboard",
            query,
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg'),
        };
    }
    async getEditAgentPage(id, req) {
        try {
            const agent = await this.usersService.findOne(id);
            if (agent.role !== user_schema_1.UserRole.AGENT) {
                req.flash("error_msg", "User is not an agent.");
                return req.res.redirect("/users/dashboard/agents");
            }
            return {
                title: "Edit Agent - Dashboard",
                agent,
                user: req.user,
                layout: "layouts/dashboard",
                success_msg: req.flash('success_msg'),
                error_msg: req.flash('error_msg'),
            };
        }
        catch (error) {
            req.flash("error_msg", error.message);
            return req.res.redirect("/users/dashboard/agents");
        }
    }
    async adminUpdateAgent(id, updateUserDto, req, res) {
        try {
            delete updateUserDto.status;
            const updatedAgent = await this.usersService.update(id, updateUserDto, req.user.id);
            req.flash("success_msg", `Agent ${updatedAgent.name}'s details updated successfully.`);
            return res.redirect('/users/dashboard/agents');
        }
        catch (error) {
            req.flash("error_msg", error.message);
            return res.redirect(`/users/dashboard/agents/edit/${id}`);
        }
    }
    async activateAgent(id, req, res) {
        try {
            await this.usersService.updateAgentStatus(id, user_schema_1.UserStatus.ACTIVE, req.user.id);
            req.flash("success_msg", "Agent activated successfully");
            return res.redirect("/users/dashboard/agents");
        }
        catch (error) {
            req.flash("error_msg", error.message);
            return res.redirect("/users/dashboard/agents");
        }
    }
    async deactivateAgent(id, req, res) {
        try {
            await this.usersService.updateAgentStatus(id, user_schema_1.UserStatus.INACTIVE, req.user.id);
            req.flash("success_msg", "Agent deactivated successfully");
            return res.redirect("/users/dashboard/agents");
        }
        catch (error) {
            req.flash("error_msg", error.message);
            return res.redirect("/users/dashboard/agents");
        }
    }
    async deleteAgent(id, req, res) {
        try {
            await this.usersService.remove(id);
            req.flash("success_msg", "Agent deleted successfully");
            return res.redirect("/users/dashboard/agents");
        }
        catch (error) {
            req.flash("error_msg", error.message);
            return res.redirect("/users/dashboard/agents");
        }
    }
    async updateProfile(updateUserDto, req, res) {
        try {
            delete updateUserDto.role;
            delete updateUserDto.status;
            await this.usersService.update(req.user.id, updateUserDto, req.user.id);
            req.flash("success_msg", "Profile updated successfully");
            return res.redirect("/users/dashboard/profile");
        }
        catch (error) {
            req.flash("error_msg", error.message);
            return res.redirect("/users/dashboard/profile");
        }
    }
};
__decorate([
    (0, common_1.Get)("dashboard/agents"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Render)("dashboard/agents/index"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getAgents", null);
__decorate([
    (0, common_1.Get)("dashboard/agents/edit/:id"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard, user_ownership_guard_1.UserOwnershipGuard),
    (0, common_1.Render)("dashboard/agents/edit"),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getEditAgentPage", null);
__decorate([
    (0, common_1.Patch)("dashboard/agents/update/:id"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard, user_ownership_guard_1.UserOwnershipGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object, typeof (_b = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "adminUpdateAgent", null);
__decorate([
    (0, common_1.Post)("dashboard/agents/activate/:id"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_c = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "activateAgent", null);
__decorate([
    (0, common_1.Post)("dashboard/agents/deactivate/:id"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_d = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deactivateAgent", null);
__decorate([
    (0, common_1.Post)("dashboard/agents/delete/:id"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, typeof (_e = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteAgent", null);
__decorate([
    (0, common_1.Post)("dashboard/profile/update"),
    (0, common_1.UseGuards)(session_auth_guard_1.SessionAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, typeof (_f = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
UsersController = __decorate([
    (0, common_1.Controller)("users"),
    __metadata("design:paramtypes", [typeof (_a = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _a : Object])
], UsersController);
exports.UsersController = UsersController;


/***/ }),

/***/ "./src/modules/users/users.module.ts":
/*!*******************************************!*\
  !*** ./src/modules/users/users.module.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const users_service_1 = __webpack_require__(/*! ./users.service */ "./src/modules/users/users.service.ts");
const users_controller_1 = __webpack_require__(/*! ./users.controller */ "./src/modules/users/users.controller.ts");
const user_schema_1 = __webpack_require__(/*! ./schemas/user.schema */ "./src/modules/users/schemas/user.schema.ts");
const mail_module_1 = __webpack_require__(/*! ../mail/mail.module */ "./src/modules/mail/mail.module.ts");
let UsersModule = class UsersModule {
};
UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: user_schema_1.User.name, schema: user_schema_1.UserSchema }]), mail_module_1.MailModule],
        controllers: [users_controller_1.UsersController],
        providers: [users_service_1.UsersService],
        exports: [users_service_1.UsersService],
    })
], UsersModule);
exports.UsersModule = UsersModule;


/***/ }),

/***/ "./src/modules/users/users.service.ts":
/*!********************************************!*\
  !*** ./src/modules/users/users.service.ts ***!
  \********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const common_1 = __webpack_require__(/*! @nestjs/common */ "@nestjs/common");
const mongoose_1 = __webpack_require__(/*! @nestjs/mongoose */ "@nestjs/mongoose");
const user_schema_1 = __webpack_require__(/*! ./schemas/user.schema */ "./src/modules/users/schemas/user.schema.ts");
const mail_service_1 = __webpack_require__(/*! ../mail/mail.service */ "./src/modules/mail/mail.service.ts");
const crypto = __importStar(__webpack_require__(/*! crypto */ "crypto"));
let UsersService = class UsersService {
    constructor(mailService, userModel) {
        this.mailService = mailService;
        this.userModel = userModel;
    }
    async create(createUserDto) {
        if (createUserDto.password !== createUserDto.confirmPassword) {
            throw new common_1.BadRequestException("Passwords do not match");
        }
        const existingUser = await this.userModel.findOne({ email: createUserDto.email });
        if (existingUser) {
            throw new common_1.ConflictException("User with this email already exists");
        }
        const newUser = new this.userModel(createUserDto);
        if (newUser.role === user_schema_1.UserRole.ADMIN) {
            newUser.status = user_schema_1.UserStatus.ACTIVE;
        }
        else {
            newUser.status = user_schema_1.UserStatus.PENDING;
            await this.mailService.sendNewAgentNotification(newUser);
        }
        return newUser.save();
    }
    async findAll() {
        return this.userModel.find().exec();
    }
    async findAllAgents() {
        return this.userModel.find({ role: user_schema_1.UserRole.AGENT }).sort({ createdAt: -1 }).exec();
    }
    async findOne(id) {
        const user = await this.userModel.findById(id).exec();
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async findById(id) {
        return this.userModel.findById(id).exec();
    }
    async findByEmail(email) {
        return this.userModel.findOne({ email }).exec();
    }
    async update(id, updateUserDto, updaterId) {
        const userToUpdate = await this.userModel.findById(id).exec();
        if (!userToUpdate) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        if (updateUserDto.name !== undefined)
            userToUpdate.name = updateUserDto.name;
        if (updateUserDto.email !== undefined) {
            if (userToUpdate.email !== updateUserDto.email) {
                const existingUserWithEmail = await this.userModel.findOne({ email: updateUserDto.email }).exec();
                if (existingUserWithEmail && existingUserWithEmail._id.toString() !== id) {
                    throw new common_1.ConflictException('Email already in use by another user.');
                }
            }
            userToUpdate.email = updateUserDto.email;
        }
        if (updateUserDto.phoneNumber !== undefined)
            userToUpdate.phoneNumber = updateUserDto.phoneNumber;
        if (updateUserDto.companyName !== undefined)
            userToUpdate.companyName = updateUserDto.companyName;
        if (updateUserDto.companyWebsite !== undefined)
            userToUpdate.companyWebsite = updateUserDto.companyWebsite;
        if (updateUserDto.country !== undefined)
            userToUpdate.country = updateUserDto.country;
        if (updateUserDto.role !== undefined)
            userToUpdate.role = updateUserDto.role;
        if (updaterId) {
            userToUpdate['updatedBy'] = updaterId;
        }
        try {
            return await userToUpdate.save();
        }
        catch (error) {
            if (error.code === 11000) {
                throw new common_1.ConflictException('A user with this email already exists.');
            }
            throw error;
        }
    }
    async updateAgentStatus(id, newStatus, updaterId) {
        const agent = await this.userModel.findById(id).exec();
        if (!agent) {
            throw new common_1.NotFoundException(`Agent with ID ${id} not found`);
        }
        if (agent.role !== user_schema_1.UserRole.AGENT) {
            throw new common_1.BadRequestException("User is not an agent. Only agents can have their status toggled.");
        }
        if (!Object.values(user_schema_1.UserStatus).includes(newStatus)) {
            throw new common_1.BadRequestException(`Invalid status provided: ${newStatus}`);
        }
        agent.status = newStatus;
        if (updaterId) {
            agent['updatedBy'] = updaterId;
        }
        await agent.save();
        if (newStatus === user_schema_1.UserStatus.ACTIVE) {
            await this.mailService.sendAgentActivationEmail(agent);
        }
        else if (newStatus === user_schema_1.UserStatus.INACTIVE) {
            await this.mailService.sendAgentDeactivationEmail(agent);
        }
        return agent;
    }
    async remove(id) {
        const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
        if (!deletedUser) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return deletedUser;
    }
    async createForgotPasswordToken(email) {
        const user = await this.userModel.findOne({ email }).exec();
        if (!user) {
            throw new common_1.NotFoundException(`User with email ${email} not found`);
        }
        const token = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 3600000);
        await user.save();
        await this.mailService.sendPasswordResetEmail(user, token);
        return token;
    }
    async resetPassword(token, password, confirmPassword) {
        if (password !== confirmPassword) {
            throw new common_1.BadRequestException("Passwords do not match");
        }
        const user = await this.userModel
            .findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        })
            .exec();
        if (!user) {
            throw new common_1.BadRequestException("Password reset token is invalid or has expired");
        }
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        await this.mailService.sendPasswordChangedEmail(user);
        return user;
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [typeof (_a = typeof mail_service_1.MailService !== "undefined" && mail_service_1.MailService) === "function" ? _a : Object, Object])
], UsersService);
exports.UsersService = UsersService;


/***/ }),

/***/ "@nestjs/common":
/*!*********************************!*\
  !*** external "@nestjs/common" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/config":
/*!*********************************!*\
  !*** external "@nestjs/config" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@nestjs/config");

/***/ }),

/***/ "@nestjs/core":
/*!*******************************!*\
  !*** external "@nestjs/core" ***!
  \*******************************/
/***/ ((module) => {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/mapped-types":
/*!***************************************!*\
  !*** external "@nestjs/mapped-types" ***!
  \***************************************/
/***/ ((module) => {

module.exports = require("@nestjs/mapped-types");

/***/ }),

/***/ "@nestjs/mongoose":
/*!***********************************!*\
  !*** external "@nestjs/mongoose" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/mongoose");

/***/ }),

/***/ "@nestjs/passport":
/*!***********************************!*\
  !*** external "@nestjs/passport" ***!
  \***********************************/
/***/ ((module) => {

module.exports = require("@nestjs/passport");

/***/ }),

/***/ "@nestjs/platform-express":
/*!*******************************************!*\
  !*** external "@nestjs/platform-express" ***!
  \*******************************************/
/***/ ((module) => {

module.exports = require("@nestjs/platform-express");

/***/ }),

/***/ "@nestjs/serve-static":
/*!***************************************!*\
  !*** external "@nestjs/serve-static" ***!
  \***************************************/
/***/ ((module) => {

module.exports = require("@nestjs/serve-static");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ "class-transformer":
/*!************************************!*\
  !*** external "class-transformer" ***!
  \************************************/
/***/ ((module) => {

module.exports = require("class-transformer");

/***/ }),

/***/ "class-validator":
/*!**********************************!*\
  !*** external "class-validator" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("class-validator");

/***/ }),

/***/ "connect-flash":
/*!********************************!*\
  !*** external "connect-flash" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("connect-flash");

/***/ }),

/***/ "connect-mongo":
/*!********************************!*\
  !*** external "connect-mongo" ***!
  \********************************/
/***/ ((module) => {

module.exports = require("connect-mongo");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "express-ejs-layouts":
/*!**************************************!*\
  !*** external "express-ejs-layouts" ***!
  \**************************************/
/***/ ((module) => {

module.exports = require("express-ejs-layouts");

/***/ }),

/***/ "express-session":
/*!**********************************!*\
  !*** external "express-session" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("express-session");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ "method-override":
/*!**********************************!*\
  !*** external "method-override" ***!
  \**********************************/
/***/ ((module) => {

module.exports = require("method-override");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("mongoose");

/***/ }),

/***/ "mongoose-paginate-v2":
/*!***************************************!*\
  !*** external "mongoose-paginate-v2" ***!
  \***************************************/
/***/ ((module) => {

module.exports = require("mongoose-paginate-v2");

/***/ }),

/***/ "multer":
/*!*************************!*\
  !*** external "multer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("multer");

/***/ }),

/***/ "nodemailer":
/*!*****************************!*\
  !*** external "nodemailer" ***!
  \*****************************/
/***/ ((module) => {

module.exports = require("nodemailer");

/***/ }),

/***/ "passport":
/*!***************************!*\
  !*** external "passport" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("passport");

/***/ }),

/***/ "passport-local":
/*!*********************************!*\
  !*** external "passport-local" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("passport-local");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "slugify":
/*!**************************!*\
  !*** external "slugify" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("slugify");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("uuid");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.ts");
/******/ 	
/******/ })()
;