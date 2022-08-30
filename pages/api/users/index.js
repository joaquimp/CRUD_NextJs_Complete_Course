import connectMongo from '../../../database/conn'
import { getUsers, postUser, putUser, deleteUser } from '../../../database/controller';

import Cors from 'cors'

const cors = Cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
})

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result)
            }
            return resolve(result)
        })
    })
}

export default async function handler(req, res) {

    await runMiddleware(req, res, cors);
    connectMongo().catch(() => res.status(405).json({ error: "Error in the Connection" }))

    // type of request
    const { method } = req

    switch (method) {
        case 'GET':
            getUsers(req, res)
            break;
        case 'POST':
            postUser(req, res)
            break;
        case 'PUT':
            putUser(req, res)
            break;
        case 'DELETE':
            deleteUser(req, res)
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${method} Not Allowd`)
            break;
    }
}
