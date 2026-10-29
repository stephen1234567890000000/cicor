-- Tambahkan revisionNo sementara agar data lama bisa diisi
ALTER TABLE "testing_requisitions"
ADD COLUMN "revisionNo" INTEGER;

-- Ubah trialNo lama menjadi teks sementara agar format lama bisa dibaca
ALTER TABLE "testing_requisitions"
ALTER COLUMN "trialNo" TYPE TEXT
USING "trialNo"::TEXT;

-- Buat kolom trialNo baru bertipe angka
ALTER TABLE "testing_requisitions"
ADD COLUMN "trialNo_new" INTEGER;

-- Berikan nomor 0, 1, 2, 3, ... pada seluruh data lama
WITH numbered AS (
  SELECT
    "id",
    ROW_NUMBER() OVER (
      ORDER BY "testDate" ASC, "id" ASC
    ) - 1 AS seq
  FROM "testing_requisitions"
)
UPDATE "testing_requisitions" AS tr
SET
  "revisionNo" = numbered.seq,
  "trialNo_new" = numbered.seq
FROM numbered
WHERE tr."id" = numbered."id";

-- Hapus kolom trialNo lama setelah nilainya diproses
ALTER TABLE "testing_requisitions"
DROP COLUMN "trialNo";

-- Ganti nama kolom baru
ALTER TABLE "testing_requisitions"
RENAME COLUMN "trialNo_new" TO "trialNo";

-- Jadikan kedua kolom wajib diisi
ALTER TABLE "testing_requisitions"
ALTER COLUMN "revisionNo" SET NOT NULL,
ALTER COLUMN "trialNo" SET NOT NULL;

-- Buat counter untuk penomoran otomatis
CREATE TABLE "testing_requisition_counter" (
  "id" INTEGER NOT NULL,
  "nextNumber" INTEGER NOT NULL,
  CONSTRAINT "testing_requisition_counter_pkey" PRIMARY KEY ("id")
);

-- Inisialisasi counter berdasarkan jumlah data lama
INSERT INTO "testing_requisition_counter" ("id", "nextNumber")
SELECT 1, COUNT(*)::INTEGER - 1
FROM "testing_requisitions";