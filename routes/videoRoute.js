import express from "express";
import {
  getVideos,
//   getAdminVideos,
  getVideo,
  createVideo,
//   updateVideo,
  deleteVideo,
} from "../controllers/videoController.js";

// import adminAuth from "../middleware/adminAuth.js";
import upload from "../config/multer.js";

const router = express.Router();

router.get("/", getVideos);
// router.get("/admin/all", adminAuth, getAdminSongs);
router.get("/:id", getVideo);

//   adminAuth,

router.post(
  "/",
  upload.fields([
    { name: "video", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  createVideo
);


//   adminAuth,

// router.put(
//   "/:id",
//   upload.fields([
//     { name: "video", maxCount: 1 },
//     { name: "coverImage", maxCount: 1 },
//   ]),
//   updateVideo,
// );

// adminAuth

router.delete("/:id", deleteVideo);

export default router;