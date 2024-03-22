export const toEvent = (uow) => {
  console.log(`uow: ${JSON.stringify(uow)}`);

  // const data = uow.event.raw.new || uow.event.raw.old;
  // const records = uow.queryResponse.map((r) => (r.discriminator === DISCRIMINATOR ? data : r));
  // const thing = await AGGREGATE_MAPPER(records);
  // return {
  //     type: uow.event.type === 'thing-deleted'
  //         ? /* istanbul ignore next */ uow.event.type
  //         : STATUS_EVENT_MAP[data.status] || /* istanbul ignore next */ uow.event.type,
  //     timestamp: data.timestamp || uow.event.timestamp,
  //     thing,
  //     raw: undefined,
  // };

  return {
    test1: "ala",
    test2: "bala",
  };
};
