import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";
import { gameSchema } from "../schemas/games.schema.js";
import { postGames, getGames } from "../controllers/games.controllers.js";

const gamesRouter = Router();

gamesRouter.post("/games", postGames);
gamesRouter.get("/games", validateSchema(gameSchema), getGames);

export default gamesRouter;