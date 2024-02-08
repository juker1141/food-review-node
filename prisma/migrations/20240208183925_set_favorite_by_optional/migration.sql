-- DropForeignKey
ALTER TABLE "Shop" DROP CONSTRAINT "Shop_favoriteById_fkey";

-- AlterTable
ALTER TABLE "Shop" ALTER COLUMN "favoriteById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Shop" ADD CONSTRAINT "Shop_favoriteById_fkey" FOREIGN KEY ("favoriteById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
