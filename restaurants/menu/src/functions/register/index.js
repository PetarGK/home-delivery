import { Restaurant } from "../../connectors/dynamodb";
import { createRestaurant } from "../../routes/restaurants";

const api = require("lambda-api")();

api.use((req, res, next) => {
  res.cors();
  next();
});

api.post(`${process.env.STAGE}/restaurants`, createRestaurant);

export const handle = async (event, context) => {
  console.log(`Event: ${JSON.stringify(event)}`);

  api.app({
    models: {
      restaurant: Restaurant,
    },
  });

  return api.run(event, context);
};
