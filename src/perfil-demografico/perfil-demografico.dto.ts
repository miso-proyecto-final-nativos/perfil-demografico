import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class PerfilDemograficoDto {
  @IsNumber()
  id: number;

  @IsNumber()
  @IsNotEmpty()
  idDeportista: number;

  @IsString()
  @IsNotEmpty()
  nombres: string;

  @IsString()
  @IsNotEmpty()
  apellidos: string;

  @IsString()
  @IsNotEmpty()
  paisNacimiento: string;

  @IsString()
  @IsNotEmpty()
  ciudadNacimiento: string;

  @IsNumber()
  @IsNotEmpty()
  tipoIdentificacion: number;

  @IsString()
  @IsNotEmpty()
  numeroIdentificacion: string;

  @IsString()
  genero: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  fechaNacimiento: Date;

  @IsNumber()
  @IsOptional()
  peso: number;

  @IsNumber()
  @IsOptional()
  estatura: number;

  @IsString()
  @IsOptional()
  paisResidencia: string;

  @IsString()
  @IsOptional()
  ciudadResidencia: string;
}
