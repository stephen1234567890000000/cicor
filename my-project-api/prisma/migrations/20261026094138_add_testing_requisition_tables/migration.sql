-- CreateTable
CREATE TABLE "processes" (
    "id" TEXT NOT NULL,
    "processName" TEXT NOT NULL,

    CONSTRAINT "processes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testing_reasons" (
    "id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,

    CONSTRAINT "testing_reasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "productNo" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "processId" TEXT NOT NULL,
    "productDrawingNumber" TEXT NOT NULL,
    "mouldNo" TEXT NOT NULL,
    "equipmentNo" TEXT NOT NULL,
    "cavityNo" TEXT NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_products" (
    "customerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "customer_products_pkey" PRIMARY KEY ("customerId","productId")
);

-- CreateTable
CREATE TABLE "testing_requisitions" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "trialNo" TEXT NOT NULL,
    "testDate" DATE NOT NULL,
    "testingReasonId" TEXT NOT NULL,
    "mcName" TEXT NOT NULL,
    "inspectionSample" INTEGER NOT NULL,
    "toolroomSample" INTEGER NOT NULL,
    "clientSample" INTEGER NOT NULL,

    CONSTRAINT "testing_requisitions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "processes_processName_key" ON "processes"("processName");

-- CreateIndex
CREATE UNIQUE INDEX "testing_reasons_reason_key" ON "testing_reasons"("reason");

-- CreateIndex
CREATE INDEX "customer_products_productId_idx" ON "customer_products"("productId");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_processId_fkey" FOREIGN KEY ("processId") REFERENCES "processes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_products" ADD CONSTRAINT "customer_products_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_products" ADD CONSTRAINT "customer_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testing_requisitions" ADD CONSTRAINT "testing_requisitions_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testing_requisitions" ADD CONSTRAINT "testing_requisitions_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "testing_requisitions" ADD CONSTRAINT "testing_requisitions_testingReasonId_fkey" FOREIGN KEY ("testingReasonId") REFERENCES "testing_reasons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
