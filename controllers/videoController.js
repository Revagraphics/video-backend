import Video from "../models/videoModel.js";
import { uploadVideo, uploadImage } from "../config/cloudinary.js";

const videoFields = "title coverImage videoUrl duration isPublished createdAt updatedAt";

export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find({ isPublished: true })
      .sort({ createdAt: -1 })
      .select(videoFields);
      
    return res.status(200).json({ success: true, count: videos.length, videos });
  } catch (error) {
    console.error("Get videos Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch videos" });
  }
};

// export const getAdminSongs = async (req, res) => {
//   try {
//     const songs = await Song.find().sort({ createdAt: -1 }).select(songFields);
//     return res.json({ success: true, count: songs.length, songs });
//   } catch (error) {
//     console.error("Get Admin Songs Error:", error);
//     return res.status(500).json({ success: false, message: "Failed to fetch admin songs" });
//   }
// };

export const getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }

    return res.status(200).json({ success: true, video });
  } catch (error) {
    console.error("Get Video Error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch video" });
  }
};

export const createVideo = async (req, res) => {
  try {
    const { title, discription, category, coverImage, videoUrl: bodyVideoUrl } = req.body;
    const videoFile = req.files?.video?.[0];
    const coverFile = req.files?.coverImage?.[0];

    if (!title || !discription || !category || (!videoFile && !bodyVideoUrl)) {
      return res.status(400).json({
        success: false,
        message: "Title, description, category, and a video file or URL are required",
      });
    }

    const [uploadedVideo, uploadedCover] = await Promise.all([
      videoFile ? uploadVideo(videoFile.buffer) : null,
      coverFile ? uploadImage(coverFile.buffer) : null,
    ]);
    const videoUrl = uploadedVideo?.secure_url || bodyVideoUrl;
    const uploadedCoverImage = uploadedCover?.secure_url || coverImage;

    const video = await Video.create({
      title,
      discription,
      category,
      coverImage: uploadedCoverImage,
      videoUrl,
    });

    return res.status(201).json({ success: true, message: "Video added successfully", video });
  } catch (error) {
    if (error?.http_code === 403 || error?.httpCode === 403) {
      const resourceType = error.resourceType || "unknown";
      console.error("Cloudinary rejected upload:", {
        resourceType,
        message: error.message,
        httpCode: error.http_code || error.httpCode,
      });
      return res.status(502).json({
        success: false,
        message: `Cloudinary rejected the ${resourceType} upload (403). Check API key upload permissions and Cloudinary account/security restrictions.`,
      });
    }

    console.error("Create Video Error:", error);
    return res.status(500).json({ success: false, message: "Failed to create video" });
  }
};

// export const updateSong = async (req, res) => {
//   try {
//     const editableFields = ["title", "coverImage", "videoUrl", "isPublished"];
//     const updates = Object.fromEntries(
//       Object.entries(req.body).filter(([field]) => editableFields.includes(field))
//     );

//     const audioFile = req.files?.audio?.[0];
//     const coverFile = req.files?.coverImage?.[0];
//     const [uploadedAudio, uploadedCover] = await Promise.all([
//       audioFile ? uploadAudio(audioFile.buffer) : null,
//       coverFile ? uploadImage(coverFile.buffer) : null,
//     ]);

//     if (uploadedAudio) updates.audioUrl = uploadedAudio.secure_url;
//     if (uploadedCover) updates.coverImage = uploadedCover.secure_url;

//     const song = await Song.findByIdAndUpdate(req.params.id, updates, {
//       new: true,
//       runValidators: true,
//     });

//     if (!song) {
//       return res.status(404).json({ success: false, message: "Song not found" });
//     }

//     return res.status(200).json({ success: true, message: "Song updated successfully", song });
//   } catch (error) {
//     console.error("Update Song Error:", error);
//     return res.status(500).json({ success: false, message: "Failed to update song" });
//   }
// };

export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);

    if (!video) {
      return res.status(404).json({ success: false, message: "Video not found" });
    }

    return res.status(200).json({ success: true, message: "Video deleted successfully" });
  } catch (error) {
    console.error("Delete Video Error:", error);
    return res.status(500).json({ success: false, message: "Failed to delete video" });
  }
};