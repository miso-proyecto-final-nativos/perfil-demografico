import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Put,
  RequestTimeoutException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { plainToInstance } from 'class-transformer';
import {
  catchError,
  firstValueFrom,
  throwError,
  timeout,
  TimeoutError,
} from 'rxjs';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PerfilDemograficoEntity } from './entity/perfil-demografico.entity';
import { AuthGuard } from './guards/auth.guard';
import { PerfilDemograficoDto } from './perfil-demografico.dto';
import { PerfilDemograficoService } from './perfil-demografico.service';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('perfil-demografico')
export class PerfilDemograficoController {
  constructor(
    @Inject('MS_CATALOGO_SERVICE') private clienteCatalogoService: ClientProxy,
    @Inject('USER_MS') private clienteUsuarioService: ClientProxy,
    private readonly perfilDemograficoService: PerfilDemograficoService,
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get('health')
  @HealthCheck()
  async healthCheck() {
    return this.health.check([async () => this.db.pingCheck('database')]);
  }

  @UseGuards(AuthGuard)
  @Get(':idDeportista')
  async findByDeportistaId(@Param('idDeportista') idDeportista: number) {
    return await this.perfilDemograficoService.findByDeportistaId(idDeportista);
  }

  @UseGuards(AuthGuard)
  @Post(':idDeportista')
  async create(
    @Param('idDeportista') idDeportista: number,
    @Body() perfilDemograficoDto: PerfilDemograficoDto,
  ) {
    await this.validarIdDeportista(idDeportista);
    await this.validarTipoIdentificacion(
      perfilDemograficoDto.tipoIdentificacion,
    );
    perfilDemograficoDto.idDeportista = idDeportista;
    const perfilDemograficoEntity: PerfilDemograficoEntity = plainToInstance(
      PerfilDemograficoEntity,
      perfilDemograficoDto,
    );
    return await this.perfilDemograficoService.create(perfilDemograficoEntity);
  }

  @UseGuards(AuthGuard)
  @Put(':idDeportista')
  async update(
    @Param('idDeportista') idDeportista: number,
    @Body() perfilDemograficoDto: PerfilDemograficoDto,
  ) {
    await this.validarIdDeportista(idDeportista);
    await this.validarTipoIdentificacion(
      perfilDemograficoDto.tipoIdentificacion,
    );
    perfilDemograficoDto.idDeportista = idDeportista;
    const perfilDemograficoEntity: PerfilDemograficoEntity = plainToInstance(
      PerfilDemograficoEntity,
      perfilDemograficoDto,
    );
    return await this.perfilDemograficoService.update(
      idDeportista,
      perfilDemograficoEntity,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':idDeportista')
  @HttpCode(204)
  async delete(@Param('idDeportista') idDeportista: number) {
    return await this.perfilDemograficoService.delete(idDeportista);
  }

  private async validarIdDeportista(idDeportista: number) {
    const deportista$ = this.clienteUsuarioService
      .send({ role: 'user', cmd: 'getById' }, { idDeportista })
      .pipe(
        timeout(5000),
        catchError((err) => {
          if (err instanceof TimeoutError) {
            return throwError(() => new RequestTimeoutException());
          }
          return throwError(() => err);
        }),
      );

    const deportista = await firstValueFrom(deportista$);

    if (!deportista) {
      throw new BusinessLogicException(
        `No se encontró un deportista con el id ${idDeportista}`,
        BusinessError.NOT_FOUND,
      );
    }
  }

  private async validarTipoIdentificacion(idTipoDocumento: number) {
    const tipoDocumento$ = this.clienteCatalogoService
      .send(
        { role: 'tipoDocumento', cmd: 'getById' },
        { idTipoDocumento: idTipoDocumento },
      )
      .pipe(
        timeout(5000),
        catchError((err) => {
          if (err instanceof TimeoutError) {
            return throwError(() => new RequestTimeoutException());
          }
          return throwError(() => err);
        }),
      );

    const tipoDocumento = await firstValueFrom(tipoDocumento$);

    if (!tipoDocumento) {
      throw new BusinessLogicException(
        `No se encontró un tipo de documento con el id ${idTipoDocumento}`,
        BusinessError.NOT_FOUND,
      );
    }
  }
}
