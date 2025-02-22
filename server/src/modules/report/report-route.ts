import express from "express";
import ReportController from "./controllers/ReportController";
import ReportRepository from "./repositories/ReportRepository";
import ReportService from "./services/ReportService";
import { authenticateJWT } from "../../middlewares/authenticateJWT";

const reportRepository = new ReportRepository();
const reportService = new ReportService(reportRepository);
const reportController = new ReportController(reportService);

const reportRouter = express.Router();

reportRouter.post("/reports/submit",authenticateJWT, reportController.reportLecture.bind(reportController));

reportRouter.get("/reports", authenticateJWT,reportController.getReports.bind(reportController));

export default reportRouter;
