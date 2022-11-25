import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Genero } from '../genero.enum';

@Entity()
export class PerfilDemograficoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  idDeportista: number;

  @Column()
  nombres: string;

  @Column()
  apellidos: string;

  @Column()
  paisNacimiento: string;

  @Column()
  ciudadNacimiento: string;

  @Column()
  tipoIdentificacion: number;

  @Column()
  numeroIdentificacion: number;

  @Column({ enum: Genero })
  genero: string;

  @Column()
  fechaNacimiento?: Date;

  @Column({ type: 'real' })
  peso?: number;

  @Column({ type: 'real' })
  estatura?: number;

  @Column()
  paisResidencia?: string;

  @Column()
  ciudadResidencia?: string;
}
