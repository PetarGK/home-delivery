import { cdc } from "aws-lambda-stream";

import { toEvent as toRestaurantEvent } from "../../mappers/restaurants";

export default [
  {
    id: "r1",
    flavor: cdc,
    eventType: /restaurant-(created|updated|deleted)/,
    toEvent: toRestaurantEvent,
    queryRelated: true,
  },
];
