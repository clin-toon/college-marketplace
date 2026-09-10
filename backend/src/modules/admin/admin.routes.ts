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
  "/admin/users/:id/posting-permission",
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
router.put(
  "/admin/categories/:id",
  validate({ params: categoryIdParamSchema, body: updateCategorySchema }),
  adminController.updateCategoryHandler,
);
router.delete(
  "/admin/categories/:id",
  validate({ params: categoryIdParamSchema }),
  adminController.deleteCategoryHandler,
);

export default router;
