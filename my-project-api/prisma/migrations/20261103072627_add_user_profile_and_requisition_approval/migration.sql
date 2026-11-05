-- CreateTable
CREATE TABLE "user_profile" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "profilePicture" TEXT,
    "signature" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "user_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "requisition_approval" (
    "id" TEXT NOT NULL,
    "testingRequisitionId" TEXT NOT NULL,
    "userProfileId" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "signAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "requisition_approval_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_profile_userId_key" ON "user_profile"("userId");

-- CreateIndex
CREATE INDEX "requisition_approval_testingRequisitionId_idx" ON "requisition_approval"("testingRequisitionId");

-- CreateIndex
CREATE INDEX "requisition_approval_userProfileId_idx" ON "requisition_approval"("userProfileId");

-- AddForeignKey
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requisition_approval" ADD CONSTRAINT "requisition_approval_testingRequisitionId_fkey" FOREIGN KEY ("testingRequisitionId") REFERENCES "testing_requisitions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "requisition_approval" ADD CONSTRAINT "requisition_approval_userProfileId_fkey" FOREIGN KEY ("userProfileId") REFERENCES "user_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
