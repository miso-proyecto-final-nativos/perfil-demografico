import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configuration } from '../config/configuration';
import { PerfilDemograficoEntity } from './entity/perfil-demografico.entity';
import { PerfilDemograficoService } from './perfil-demografico.service';
import { PerfilDemograficoController } from './perfil-demografico.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${process.cwd()}/src/config/env/${
        process.env.NODE_ENV
      }.env`,
      load: [configuration],
    }),
    TypeOrmModule.forFeature([PerfilDemograficoEntity]),
    TerminusModule,
  ],
  providers: [
    {
      provide: 'MS_CATALOGO_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('catalogo_microservice.host'),
            port: configService.get<number>('catalogo_microservice.port'),
          },
        }),
    },
    {
      provide: 'AUTH_CLIENT',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('auth_microservice.host'),
            port: configService.get<number>('auth_microservice.port'),
          },
        }),
    },
    {
      provide: 'USER_MS',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('usuario_microservice.host'),
            port: configService.get<number>('usuario_microservice.port'),
          },
        }),
    },
    PerfilDemograficoService,
  ],
  controllers: [PerfilDemograficoController],
})
export class PerfilDemograficoModule {}
