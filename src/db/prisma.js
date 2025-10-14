import { PrismaClient } from "../generated/prisma/index.js";

const globalForPrisma = globalThis;

const prismaClientSingleton = () => {
	return new PrismaClient({
		log:
			process.env.NODE_ENV === "development"
				? ["query", "error", "warn"]
				: ["error"],
		datasources: {
			db: {
				url: process.env.DATABASE_URL,
			},
		},
	});
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

async function executeWithRetry(operation, retries = MAX_RETRIES) {
	try {
		return await operation();
	} catch (error) {
		const shouldRetry =
			error.code === "P1001" ||
			error.code === "P1017" ||
			error.code === "P2024" ||
			error.message?.includes("Can't reach database") ||
			error.message?.includes("timeout") ||
			error.message?.includes("Connection terminated");

		if (shouldRetry && retries > 0) {
			console.warn(
				`Database error (${error.code || "unknown"}), retrying... (${
					MAX_RETRIES - retries + 1
				}/${MAX_RETRIES})`
			);
			await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
			return executeWithRetry(operation, retries - 1);
		}

		throw error;
	}
}

prisma.$use(async (params, next) => {
	return executeWithRetry(() => next(params));
});

if (process.env.VERCEL) {
	prisma.$connect().catch((error) => {
		console.error("Failed to connect to database:", error);
	});

	process.on("beforeExit", async () => {
		await prisma.$disconnect();
	});
}

export default prisma;

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}
