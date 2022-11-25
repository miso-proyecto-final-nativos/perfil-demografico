import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { PerfilDemograficoEntity } from './entity/perfil-demografico.entity';

@Injectable()
export class PerfilDemograficoService {
  constructor(
    @InjectRepository(PerfilDemograficoEntity)
    private readonly perfilDemograficoRepository: Repository<PerfilDemograficoEntity>,
  ) {}

  async findByDeportistaId(
    idDeportista: number,
  ): Promise<PerfilDemograficoEntity> {
    const perfilDemografico: PerfilDemograficoEntity =
      await this.validarPerfilDemografico(idDeportista);
    return perfilDemografico;
  }

  private async validarPerfilDemografico(idDeportista: number) {
    const perfilDemografico: PerfilDemograficoEntity =
      await this.perfilDemograficoRepository.findOne({
        where: { idDeportista: idDeportista },
      });
    if (!perfilDemografico)
      throw new BusinessLogicException(
        'No se encontró un perfil demográfico para el id de deportista suministrado',
        BusinessError.NOT_FOUND,
      );
    return perfilDemografico;
  }

  async create(
    perfilDemografico: PerfilDemograficoEntity,
  ): Promise<PerfilDemograficoEntity> {
    await this.validarIdDeportista(perfilDemografico.idDeportista);
    return await this.perfilDemograficoRepository.save(perfilDemografico);
  }

  private async validarIdDeportista(idDeportista: number) {
    const perfilDemografico: PerfilDemograficoEntity =
      await this.perfilDemograficoRepository.findOne({
        where: { idDeportista: idDeportista },
      });
    if (perfilDemografico)
      throw new BusinessLogicException(
        `Ya existe un perfil demográfico asociado al id ${perfilDemografico.idDeportista}`,
        BusinessError.PRECONDITION_FAILED,
      );
  }

  async update(
    idDeportista: number,
    perfilDemografico: PerfilDemograficoEntity,
  ): Promise<PerfilDemograficoEntity> {
    const persistedPerfilDemografico: PerfilDemograficoEntity =
      await this.validarPerfilDemografico(idDeportista);
    return await this.perfilDemograficoRepository.save({
      ...persistedPerfilDemografico,
      ...perfilDemografico,
    });
  }

  async delete(idDeportista: number) {
    const perfilDemografico: PerfilDemograficoEntity =
      await this.validarPerfilDemografico(idDeportista);
    await this.perfilDemograficoRepository.delete(perfilDemografico);
  }
}
