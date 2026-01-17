import jwt, { JwtPayload as JwtLibPayload } from "jsonwebtoken";

const checkToken = async (token: string) => {
    try {
        const decoded = jwt.verify(token, `${process.env.JWT_SECRET}`) as JwtLibPayload | string;
        if (typeof decoded === "string") {
            return null;
        }
        return decoded;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export default checkToken;