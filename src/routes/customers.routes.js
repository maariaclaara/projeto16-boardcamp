import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";
import { customerSchema } from "../schemas/customers.schema.js";
import { getCustomers, getIdCustomers, postCustomers, putCustomers } from "../controllers/customers.controllers.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getIdCustomers);
customersRouter.post("/customers", validateSchema(customerSchema), postCustomers);
customersRouter.put("/customers/:id", validateSchema(customerSchema), putCustomers);

export default  customersRouter;