import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
  userIdParamSchema,
  listingIdParamSchema,
  categoryIdParamSchema,
  adminListUsersQuerySchema,
  updateUserRoleSchema,
  updatePostingPermissionSchema,
  adminListListingsQuerySchema,
  updateListingStatusSchema,
  createCategorySchema,
  updateCategorySchema,
} from "./admin.validation";
import * as adminController from "./admin.controllers";
import * as v from "./adminListing.validation";
import * as c from "./adminListing.controllers";

const router = Router();

// every admin route requires a logged-in admin — applied once, up front
router.use(authenticate, authorize("admin"));

// ---------- Dashboard ----------
router.get("/admin/stats", adminController.getStatsHandler);

// ---------- Users ----------
router.get(
  "/admin/users",
  validate({ query: adminListUsersQuerySchema }),
  adminController.getUsersHandler,
);
router.get(
  "/admin/users/:id",
  validate({ params: userIdParamSchema }),
  adminController.getUserDetailHandler,
);
router.patch(
  "/admin/users/:id/role",
  validate({ params: userIdParamSchema, body: updateUserRoleSchema }),
  adminController.updateUserRoleHandler,
);
router.patch(
  "/admin/users/:id/posting-access",
  validate({ params: userIdParamSchema, body: updatePostingPermissionSchema }),
  adminController.updatePostingPermissionHandler,
);
router.delete(
  "/admin/users/:id",
  validate({ params: userIdParamSchema }),
  adminController.deleteUserHandler,
);

// ---------- Listings ----------
router.get(
  "/admin/listings",
  validate({ query: adminListListingsQuerySchema }),
  adminController.getListingsAdminHandler,
);
router.patch(
  "/admin/listings/:id/status",
  validate({ params: listingIdParamSchema, body: updateListingStatusSchema }),
  adminController.updateListingStatusHandler,
);
router.delete(
  "/admin/listings/:id",
  validate({ params: listingIdParamSchema }),
  adminController.deleteListingAdminHandler,
);

// ---------- Categories ----------
router.get("/admin/categories", adminController.getCategoriesHandler);
router.post(
  "/admin/categories",
  validate({ body: createCategorySchema }),
  adminController.createCategoryHandler,
);
router.patch(
  "/admin/categories/:id",
  validate({ params: categoryIdParamSchema, body: updateCategorySchema }),
  adminController.updateCategoryHandler,
);
router.delete(
  "/admin/categories/:id",
  validate({ params: categoryIdParamSchema }),
  adminController.deleteCategoryHandler,
);

// analytics
router.get("/admin/listings/analytics/by-category", c.getByCategoryHandler);
router.get("/admin/listings/analytics/by-condition", c.getByConditionHandler);
router.get(
  "/admin/listings/analytics/timeline",
  validate({ query: v.analyticsTimelineQuerySchema }),
  c.getTimelineHandler,
);
router.get(
  "/admin/listings/analytics/price-distribution",
  c.getPriceDistributionHandler,
);
router.get(
  "/admin/listings/analytics/top-favourited",
  c.getTopFavouritedHandler,
);
router.get("/admin/listings/analytics/top-sellers", c.getTopSellersHandler);

router.get(
  "/admin/listings",
  validate({ query: v.adminListingQuerySchema }),
  c.getAllListingsHandler,
);
router.get(
  "/admin/listings/:id",
  validate({ params: v.listingIdParamSchema }),
  c.getListingDetailHandler,
);

router.patch(
  "/admin/listings/:id/hide",
  validate({ params: v.listingIdParamSchema }),
  c.hideListingHandler,
);
router.patch(
  "/admin/listings/:id/show",
  validate({ params: v.listingIdParamSchema }),
  c.showListingHandler,
);
router.patch(
  "/admin/listings/:id/status",
  validate({ params: v.listingIdParamSchema }),
  c.setStatusHandler,
);

export default router;
