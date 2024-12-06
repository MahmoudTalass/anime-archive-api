import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../helpers/errorHelpers";

function verifyToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];

    if (authHeader) {
        const token = authHeader?.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET as string, (err, payload) => {
            if (err) {
                let errorMessage = "";
                if (err.name === "TokenExpiredError") {
                    errorMessage = "Token expired.";
                } else {
                    errorMessage = "Invalid token.";
                }
                next(new AppError(errorMessage, 401));
            }

            payload = payload as JwtPayload;
            req.user = {
                id: payload.sub as string,
                username: payload.username,
            };
            next();
        });
    } else {
        next(new AppError("Authorization required.", 401));
    }
}

function unauthenticated(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader?.split(" ")[1];

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET as string, (err, payload) => {
            if (err) {
                next();
                return;
            }

            next(new AppError("You are already logged in.", 403));
            return;
        });
    }
    next();
}

export { unauthenticated, verifyToken };
