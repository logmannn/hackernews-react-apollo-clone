async function feed(parent, args, context, info) {
  const { filter, first, skip } = args; // destructure input arguments
  const where = filter
    ? { OR: [{ url_contains: filter }, { description_contains: filter }] }
    : {};

  const queriedLinks = await context.db.query.links({ first, skip, where });

  const countSelectionSet = `
      {
        aggregate {
          count
        }
      }
    `;
  const linksConnection = await context.db.query.linksConnection(
    {},
    countSelectionSet
  );

  return {
    count: linksConnection.aggregate.count,
    linkIds: queriedLinks.map(link => link.id)
  };
}

module.exports = {
  feed
};
