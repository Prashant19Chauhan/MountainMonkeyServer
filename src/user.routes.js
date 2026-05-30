
import express from "express"

import authRouter from "../user/authentication/auth.routes.js"
import profileRouter from "../user/profile/profile.routes.js"
import homeRouter from "../user/home/home.routes.js"
import userThemeMetaDataRouter from "../user/metaData/Theme.routes.js"
import userTravelerStoryRouter from "../user/travelerStory/travelerStory.routes.js"
import userTestimonialRouter from "../user/testimonial/testimonial.routes.js"
import userDestinationsRouter from "../user/destinations/destinations.routes.js"
import userPackagesRouter from "../user/packages/packages.routes.js"
import userActivitiesRouter from "../user/activities/activities.routes.js"
import userStaysRouter from "../user/stays/stays.routes.js"
import userEnquiryRouter from "../user/enquiry/enquiry.routes.js"
import userAboutRouter from "../user/about/about.routes.js"
import userContactRouter from "../user/contact/contact.routes.js"
import userFaqRouter from "../user/faq/faq.routes.js"
import userTermsRouter from "../user/terms/terms.routes.js"
import userPrivacyRouter from "../user/privacy/privacy.routes.js"
import userLocationsRouter from "../user/locations/locations.routes.js"
import userCitiesPageRouter from "../user/citiesPage/citiesPage.routes.js"
import userBlogsRouter from "../user/blogs/blogs.routes.js"
import userReviewsRouter from "../user/reviews/review.routes.js"

const baseApi = '/user'

const userRouter = express.Router();

    userRouter.use(`${baseApi}/auth`, authRouter);
    userRouter.use(`${baseApi}/enquiry`, userEnquiryRouter);
    userRouter.use(`${baseApi}/profile`, profileRouter);
    userRouter.use(`${baseApi}/home`, homeRouter);
    userRouter.use(`${baseApi}/theme-meta-data`, userThemeMetaDataRouter);
    userRouter.use(`${baseApi}/traveler-story`, userTravelerStoryRouter);
    userRouter.use(`${baseApi}/testimonial`, userTestimonialRouter);
    userRouter.use(`${baseApi}/destinations`, userDestinationsRouter);
    userRouter.use(`${baseApi}/packages`, userPackagesRouter);
    userRouter.use(`${baseApi}/activities`, userActivitiesRouter);
    userRouter.use(`${baseApi}/stays`, userStaysRouter);
    userRouter.use(`${baseApi}/about`, userAboutRouter);
    userRouter.use(`${baseApi}/contact`, userContactRouter);
    userRouter.use(`${baseApi}/faq`, userFaqRouter);
    userRouter.use(`${baseApi}/terms`, userTermsRouter);
    userRouter.use(`${baseApi}/privacy`, userPrivacyRouter);
    userRouter.use(`${baseApi}/locations`, userLocationsRouter);
    userRouter.use(`${baseApi}/cities-page`, userCitiesPageRouter);
    userRouter.use(`${baseApi}/blogs`, userBlogsRouter);
    userRouter.use(`${baseApi}/reviews`, userReviewsRouter);

export default userRouter