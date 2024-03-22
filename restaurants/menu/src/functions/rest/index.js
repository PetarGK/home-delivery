import { Restaurant, Category } from "../../connectors/dynamodb";
import { getRestaurant, updateRestaurant } from "../../routes/restaurants";
import { listCategories, saveCategory } from "../../routes/categories";

const api = require("lambda-api")();

api.use((req, res, next) => {
  res.cors();
  next();
});

api.get("/restaurants/:id", getRestaurant);
api.put("/restaurants/:id", updateRestaurant);

api.get("/restaurants/:id/categories", listCategories);
api.post("/restaurants/:id/categories", saveCategory);

export const handle = async (event, context) => {
  api.app({
    models: {
      restaurant: Restaurant,
      category: Category,
    },
  });

  return api.run(event, context);
};
