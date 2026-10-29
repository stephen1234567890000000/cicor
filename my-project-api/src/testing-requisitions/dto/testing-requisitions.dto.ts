import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateTestingRequisitionDto {
  @IsUUID()
  customerId: string;

  @IsUUID()
  productId: string;

  @IsDateString()
  testDate: string;

  @IsUUID()
  testingReasonId: string;

  @IsString()
  @IsNotEmpty()
  mcName: string;

  @IsInt()
  @Min(0)
  inspectionSample: number;

  @IsInt()
  @Min(0)
  toolroomSample: number;

  @IsInt()
  @Min(0)
  clientSample: number;
}
