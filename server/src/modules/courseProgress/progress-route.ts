import { Router } from "express";
import { ProgressRepository } from "./repositories/progressRepository";
import { ProgressService } from "./services/progressService";
import { ProgressController } from "./controllers/progressController";
import { cloudinary } from "../../config/cloudinaryConfig";
import { authenticateJWT } from "../../middlewares/authenticateJWT";

const progressRouter = Router()

const progressRepository = new ProgressRepository()
const progressService = new ProgressService(progressRepository)
const progressController = new ProgressController(progressService)

progressRouter.get('/progress/get-progress/:userId/:courseId', authenticateJWT,progressController.findProgress.bind(progressController))
progressRouter.put('/progress/update-progress/:userId/:courseId/:lectureId', authenticateJWT,progressController.markLectureCompleted.bind(progressController))
progressRouter.post('/progress/generate-certificate', authenticateJWT,progressController.generateCertificate.bind(progressController))

progressRouter.get("/download-certificate",authenticateJWT ,async (req, res) => {
  const { certificateUrl } = req.query;

  if (!certificateUrl) {
    return res.status(400).json({ message: "Certificate URL is required" });
  }

  try {
    const file = await cloudinary.v2.api.resource(certificateUrl, {
      resource_type: "raw",
    });

    const fileUrl = file.secure_url; 

    res.setHeader("Content-Disposition", "attachment; filename=certificate.pdf");
    res.setHeader("Content-Type", "application/pdf");
    res.redirect(fileUrl); 
  } catch (error) {
    return res.status(500).json({
      message: "Failed to download certificate",
      error: (error as Error).message,
    });
  }
});

export default progressRouter;