-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shippingAddress" JSONB;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false;
