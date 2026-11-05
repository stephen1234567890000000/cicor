import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class UpdateRequisitionApprovalDto {
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  signature: string;
}
