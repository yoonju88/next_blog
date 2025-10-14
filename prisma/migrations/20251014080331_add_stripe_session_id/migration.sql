-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "couponCode" TEXT,
ADD COLUMN     "pointsUsed" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "stripe_session_id" TEXT;
