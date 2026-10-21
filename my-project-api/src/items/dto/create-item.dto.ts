import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateItemDto {
  @IsString()
  sapPn: string;

  @IsString()
  starkeyPn: string;

  @IsString()
  itemName: string;

  @IsOptional()
  @IsString()
  mouldNo?: string;

  @IsOptional()
  @IsString()
  equipmentNo?: string;

  @IsOptional()
  @IsBoolean()
  testing?: boolean;

  @IsOptional()
  @IsString()
  sapPnAlt?: string | null;

  @IsOptional()
  @IsString()
  rm?: string | null;

  @IsUUID()
  materialId: string;
}
