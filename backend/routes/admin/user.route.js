import express from "express";
import {
  addUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "../../controllers/admin/user.controller";
import {
  addUserValidation,
  updateUserValidation,
} from "../../validation/admin/user.validation";
import { handleValidation } from "../../utils/helper";
import { auth, isAdmin } from "../../middleware/auth.middleware";
import { upload } from "../../middleware/upload.middleware";

const router = express.Router();

router.get("/", auth, isAdmin, getUsers);
router.get("/:userId", auth, isAdmin, getUser);
router.post(
  "/",
  auth,
  isAdmin,
  upload.single("image"),
  addUserValidation,
  handleValidation,
  addUser,
);
router.put(
  "/:userId",
  auth,
  isAdmin,
  upload.single("image"),
  updateUserValidation,
  handleValidation,
  updateUser,
);
router.delete("/:userId", auth, isAdmin, deleteUser);

export default router;
