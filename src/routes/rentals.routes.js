import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";
import { rentalSchema } from "../schemas/rentals.schema.js";
import { postRentals, getRentals, postEndRentals, deleteRentals } from "../controllers/rentals.controllers.js";

const rentalsRouter = Router();

rentalsRouter.post("/rentals", validateSchema(rentalSchema), postRentals);
rentalsRouter.post("/rentals/:id/return", postEndRentals);
rentalsRouter.get("/rentals", getRentals);
rentalsRouter.delete("/rentals/:id", deleteRentals);

export default rentalsRouter;
