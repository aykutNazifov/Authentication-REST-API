import express from "express"
import { createUser, getUserByEmail } from "../models/user"
import { authentication, random } from "../helpers"


export const login = async (req: express.Request, res: express.Response) => {
    try {

        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required!" })
        }

        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password')

        if (!user) {
            return res.status(400).json({ message: "Don't have user with this email" })
        }

        if (!user?.authentication?.salt) {
            return res.status(400).json({ message: "Something went wrong!" })
        }

        const expectedHash = authentication(user.authentication?.salt, password);

        if (user.authentication?.password !== expectedHash) {
            return res.status(400).json({ message: "Email or password invalid!" })
        }

        const salt = random()
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save()

        res.cookie("AUTH-API", user.authentication.sessionToken, { httpOnly: true, sameSite: "none", secure: false })

        return res.status(200).json(user)

    } catch (error) {
        console.log("login err", error)
        return res.sendStatus(400)
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, username, password } = req.body

        if (!email || !username || !password) {
            return res.status(400).json({ message: "All fields are required!" })
        }

        const existingUser = await getUserByEmail(email)

        if (existingUser) {
            return res.status(400).json("There is a user with this email!")
        }

        const salt = random()

        const user = await createUser({
            email,
            username,
            authentication: {
                salt,
                password: authentication(salt, password)
            }
        })

        return res.status(200).json(user)

    } catch (error) {
        console.log("er resgiter", error)
        return res.sendStatus(400)
    }
}