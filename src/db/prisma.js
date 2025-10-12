import { PrismaClient } from "../generated/prisma/index.js";

const globalForPrisma = globalThis;

const prismaClientSingleton = () => {
	return new PrismaClient({
		log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
	});
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}
