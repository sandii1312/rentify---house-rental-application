import express from "express"
import { propertyValidator } from "./../middlewares/validator.js"
import { addProperty, getAllProperty, getProperty, likeUnlikeProperty, searchProperty } from "../controllers/propertyController.js"
import protectRoute from "../middlewares/protectRoute.js"

const router = express.Router()

router.get("/", getAllProperty)
router.post("/add", propertyValidator, protectRoute , addProperty)

router.post("/search", searchProperty)

router.get("/like/:id", protectRoute, likeUnlikeProperty)

router.get("/:id", getProperty)


export default router