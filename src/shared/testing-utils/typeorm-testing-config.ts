import { TypeOrmModule } from '@nestjs/typeorm';
import { PerfilDemograficoEntity } from '../../perfil-demografico/entity/perfil-demografico.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [PerfilDemograficoEntity],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([PerfilDemograficoEntity]),
];
