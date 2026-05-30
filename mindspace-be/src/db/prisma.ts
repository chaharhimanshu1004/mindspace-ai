import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export { prisma };
export default prisma;

prisma.$connect()
    .then(() => {
        console.log("Successfully connected to Database");
    })
    .catch((e: unknown) => {
        console.error("Failed to connect to Database:", e);
        process.exit(1);
    });
