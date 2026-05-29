import express from "express"

import mediaRouter from "../admin/imageFile/media.routes.js"
import adminAuthRouter from "../admin/authentication/auth.routes.js"
import adminProfileRouter from "../admin/profile/profile.routes.js"
import packageRouter from "../admin/packages/package.routes.js"
import locationRouter from "../admin/locations/locations.routes.js"
import destinationRouter from "../admin/destinations/destination.routes.js"
import travelRouteRouter from "../admin/travelRoute/travelRoute.routes.js"
import activityRouter from "../admin/activity/activity.routes.js"
import localInfoRouter from "../admin/localInfo/localInfo.routes.js"
import stayRouter from "../admin/stays/stay.routes.js"
import themeMetaDataRouter from "../admin/themeMetaData/theme.routes.js"
import AdminHomeRouter from "../admin/content/home/home.routes.js"
import AdminDestinationsPageRouter from "../admin/content/destinationsPage/destinationsPage.routes.js"
import AdminPackagesPageRouter from "../admin/content/packagesPage/packagesPage.routes.js"
import AdminStaysPageRouter from "../admin/content/staysPage/staysPage.routes.js"
import AdminActivitiesPageRouter from "../admin/content/activitiesPage/activitiesPage.routes.js"
import adminAdvertisementRouter from "../admin/advertisement/advertisement.routes.js"
import adminTravelerStoryRouter from "../admin/travelerStory/travelerStory.routes.js"
import adminTestimonialRouter from "../admin/testimonial/testimonial.routes.js"
import metaDataRouter from "../admin/metaData/metaData.routes.js"
import adminEnquiryRouter from "../admin/enquiry/enquiry.routes.js"

const baseApis="/admin"

const adminRouter = express.Router();

    adminRouter.use(`${baseApis}/meta-data`, metaDataRouter);
    adminRouter.use(`${baseApis}/enquiry`, adminEnquiryRouter);

    adminRouter.use(`${baseApis}/testimonial`, adminTestimonialRouter);

    adminRouter.use(`${baseApis}/traveler-story`, adminTravelerStoryRouter);

    adminRouter.use(`${baseApis}/advertisement`, adminAdvertisementRouter);

    adminRouter.use(`${baseApis}/content/home`, AdminHomeRouter);
    adminRouter.use(`${baseApis}/content/destinations-page`, AdminDestinationsPageRouter);
    adminRouter.use(`${baseApis}/content/packages-page`, AdminPackagesPageRouter);
    adminRouter.use(`${baseApis}/content/stays-page`, AdminStaysPageRouter);
    adminRouter.use(`${baseApis}/content/activities-page`, AdminActivitiesPageRouter);

    adminRouter.use(`${baseApis}/theme-meta-data`, themeMetaDataRouter);

    adminRouter.use(`${baseApis}/stay`, stayRouter);

    adminRouter.use(`${baseApis}/local-info`, localInfoRouter);

    adminRouter.use(`${baseApis}/activity`, activityRouter);

    adminRouter.use(`${baseApis}/travel-routes`, travelRouteRouter);

    adminRouter.use(`${baseApis}/destinations`, destinationRouter);

    adminRouter.use(`${baseApis}/locations`, locationRouter);

    adminRouter.use(`${baseApis}/packages`, packageRouter);

    adminRouter.use(`${baseApis}/profile`, adminProfileRouter);

    adminRouter.use(`${baseApis}/auth`, adminAuthRouter);

    adminRouter.use(`${baseApis}/media`, mediaRouter);


export default adminRouter;