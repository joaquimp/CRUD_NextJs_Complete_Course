
/** Controller */
import Users from '../model/user'

export function validateUser(user) {
    console.log(user)
    const { name, avatar, email, salary, date, status } = user;
    console.log(name, avatar, email, salary, date, status);

    const nameRegex = /\w{1,50}/; // nome até 50 caracteres
    const avatarRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/;
    const emailRegex = /\S{1,20}@\S{1,20}/; // email com no maximo 20 caracteres antes e depois do @
    const dateRegex = /(0?[1-9]|[12][0-9]|3[01])[\/](0?[1-9]|1[012])[\/]\d{4}/;
    const statusRegex = /Inactive|Active/;

    let errors = [];

    if (!name || !nameRegex.test(name)) {
        console.log("Error Name", name);
        errors.push({ key: "name", message: "O nome deve conter somente letras e no máximo 50 caracteres" });
    }
    if (!avatar || !avatarRegex.test(avatar)) {
        console.log("Error Avatar", avatar);
        errors.push({ key: "avatar", message: "O avatar precisa ser uma url válida" });
    }
    if (!email || !emailRegex.test(email.toLowerCase())) {
        console.log("Error Email", email);
        errors.push({ key: "email", message: "O e-mail precisa ser válido" });
    }
    if (!salary || isNaN(parseFloat(salary)) || !isFinite(salary)) {
        console.log("Error Salary", salary);
        errors.push({ key: "salary", message: "O salário precisa ser um número válido" });
    }
    if (!date || !dateRegex.test(date)) {
        console.log("Error Date", date);
        errors.push({ key: "date", message: "A data precisa estar no formato DD/MM/YYYY" });
    }
    if (!status || !statusRegex.test(status)) {
        console.log("Error - Status", status);
        errors.push({ key: "status", message: "O estado só aceita os valores 'Inactive' ou 'Active'" });
    }

    if (errors.length === 0) return undefined
    return errors;
}

// get : http://localhost:3000/api/users
export async function getUsers(req, res) {
    try {
        const users = await Users.find({})

        if (!users) return res.status(404).json({ error: "Data not Found" })
        return res.status(200).json(users)
    } catch (error) {
        console.error(error)
        res.status(404).json({ error: "Error While Fetching Data" })
    }
}

// get : http://localhost:3000/api/users/1
export async function getUser(req, res) {
    try {
        const { userId } = req.query;

        if (userId) {
            const user = await Users.findById(userId);
            return res.status(200).json(user)
        }
        res.status(404).json({ error: "User not Selected...!" });
    } catch (error) {
        res.status(404).json({ error: "Cannot get the User...!" })
    }
}

// post : http://localhost:3000/api/users
export async function postUser(req, res) {
    try {
        const formData = req.body;
        // if (!formData) return res.status(404).json({ error: "Form Data Not Provided...!" });
        const errors = validateUser(formData);
        console.log("Errors: ", errors);
        if (errors) {
            return res.status(400).json({ errors });
        }
        Users.create(formData, function (err, data) {
            console.error("Error: ", err);
            return res.status(200).json(data)
        })
    } catch (error) {
        console.log(error);
        return res.status(404).json({ error })
    }
}

// put : http://localhost:3000/api/users/1
export async function putUser(req, res) {
    try {
        const { userId } = req.query;
        const formData = req.body;

        if (userId && formData) {
            const user = await Users.findByIdAndUpdate(userId, formData);
            return res.status(200).json(user)
        }
        res.status(404).json({ error: "User Not Selected...!" })
    } catch (error) {
        res.status(404).json({ error: "Error While Updating the Data...!" })
    }
}

// delete : http://localhost:3000/api/users/1
export async function deleteUser(req, res) {
    try {
        const { userId } = req.query;

        if (userId) {
            const user = await Users.findByIdAndDelete(userId)
            return res.status(200).json(user)
        }

        res.status(404).json({ error: "User Not Selected...!" })

    } catch (error) {
        res.status(404).json({ error: "Error While Deleting the User...!" })
    }
}