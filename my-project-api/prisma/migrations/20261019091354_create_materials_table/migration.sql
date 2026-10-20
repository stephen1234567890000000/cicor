-- CreateTable
CREATE TABLE "Material" (
    "id" TEXT NOT NULL,
    "sapPn" TEXT NOT NULL,
    "starkeyPn" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "mouldNo" TEXT,
    "equipmentNo" TEXT,
    "testing" BOOLEAN NOT NULL DEFAULT false,
    "sapPnAlt" TEXT,
    "material" TEXT,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);
