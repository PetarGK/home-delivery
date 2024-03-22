export const listCategories = async (req, res) => {
  const data = await req.namespace.models.category.query({
    name: req.params.id,
  });

  return res.status(200).json(data.Items);
};

export const saveCategory = async (req, res) => {
  await req.namespace.models.category.put({
    ...req.body,
    _restaurant: req.params.id,
  });

  return res.status(200).json({});
};
