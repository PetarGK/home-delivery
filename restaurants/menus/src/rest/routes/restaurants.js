export const getRestaurant = async (req, res) => {

    const data = await req.namespace.models.restaurant.get({ name: req.params.id });

    if (!data.Item)
        return res.status(404).json({});

    return res.status(200).json(data.Item);
}

export const saveRestaurant = async (req, res) => {

    await req.namespace.models.restaurant.put(req.body)

    return res.status(200).json({});
}
