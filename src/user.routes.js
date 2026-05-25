
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

const baseApi = '/user'

const userRouter = express.Router();

    userRouter.use(`${baseApi}/auth`, authRouter);

    userRouter.use(`${baseApi}/profile`, profileRouter);

    userRouter.use(`${baseApi}/home`, homeRouter);

    userRouter.use(`${baseApi}/theme-meta-data`, userThemeMetaDataRouter);

    userRouter.use(`${baseApi}/traveler-story`, userTravelerStoryRouter);

    userRouter.use(`${baseApi}/testimonial`, userTestimonialRouter);

    userRouter.use(`${baseApi}/destinations`, userDestinationsRouter);

    userRouter.use(`${baseApi}/packages`, userPackagesRouter);

    userRouter.use(`${baseApi}/activities`, userActivitiesRouter);

    userRouter.use(`${baseApi}/stays`, userStaysRouter);

export default userRouter