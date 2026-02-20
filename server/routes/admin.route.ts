import express from "express";
import {
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUserByAdmin,
  getAdminStats,
} from "../controllers/admin.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.get("/users", isAuthenticated, authorizeRoles("admin"), getAllUsers);

router.get(
  "/users/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  getSingleUser,
);

router.put(
  "/users/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  updateUserRole,
);

router.delete(
  "/users/:id",
  isAuthenticated,
  authorizeRoles("admin"),
  deleteUserByAdmin,
);

router.get("/stats", isAuthenticated, authorizeRoles("admin"), getAdminStats);

export default router;
