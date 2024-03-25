import express from "express"
import { getVideoSummary } from "../controllers/summary.controller.js"
const router = express.Router()

router.get("/summary", getVideoSummary)


export default router