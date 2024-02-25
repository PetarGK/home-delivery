import { z } from "zod";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc);

const statuses = {
    created: 'CREATED',
    activated: 'ACTIVATED'
}

const createSchema = z.object({
    data: z.object({
        name: z.string().min(1).max(150),
        desc: z.string().max(500),
        imgUrl: z.string().max(255),
        email: z.string().min(1).max(255).email()
    }),
    captcha: z.string().min(1)
});


export const createRestaurant = async (req, res) => {

    const validationResult = createSchema.safeParse(req.body);

    if (!validationResult.success)
        return res.status(400).json(validationResult.error.errors);

    if (req.body.captcha !== process.env.RECAPTURE_SECRET_KEY)
        return res.status(400).json({ message: "Invalid recaptcha" });

    try {
        await req.namespace.models.restaurant.put({
            ...req.body.data,
            status: statuses.created,
            ttl: dayjs.utc().add(2, "day").unix(),
        }, {
            conditions: {
                attr: 'pk', exists: false
            }
        });

        return res.status(200).json({ message: "success" });
    } catch (ex) {
        console.log(`ex: ${JSON.stringify(ex)}`);

        if (ex.name === 'ConditionalCheckFailedException')
            return res.status(400).json({ message: `Restaurant with name: '${req.body.data.name}' already exist` });
        else
            return res.status(500).json({ message: `There is error while creating restaurant` });
    }
}

export const getRestaurant = async (req, res) => {

    const data = await req.namespace.models.restaurant.get({ name: req.params.id }, {
        attributes: ['name', 'desc', 'imgUrl']
    });

    if (!data.Item)
        return res.status(404).json({});

    return res.status(200).json(data.Item);
}

export const updateRestaurant = async (req, res) => {

    const validationResult = restaurantSchema.safeParse(req.body);

    if (!validationResult.success)
        return res.status(400).json(validationResult.error.errors);

    await req.namespace.models.restaurant.put(req.body, {
        conditions: {
            attr: 'pk', exists: true
        }
    })

    return res.status(200).json({});
}

