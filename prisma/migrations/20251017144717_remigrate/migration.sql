-- AlterTable
ALTER TABLE "travel_history" ALTER COLUMN "expires_at" SET DEFAULT NOW() + INTERVAL '1 year';
