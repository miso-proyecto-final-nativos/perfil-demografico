import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { PerfilDemograficoEntity } from './entity/perfil-demografico.entity';
import { PerfilDemograficoService } from './perfil-demografico.service';
import { faker } from '@faker-js/faker';
import { Genero } from './genero.enum';

describe('PerfilDemograficoService', () => {
  let service: PerfilDemograficoService;
  let perfilDemograficoRepository: Repository<PerfilDemograficoEntity>;
  let perfilDemografico: PerfilDemograficoEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PerfilDemograficoService],
    }).compile();

    service = module.get<PerfilDemograficoService>(PerfilDemograficoService);
    perfilDemograficoRepository = module.get<
      Repository<PerfilDemograficoEntity>
    >(getRepositoryToken(PerfilDemograficoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    perfilDemograficoRepository.clear();
    perfilDemografico = await perfilDemograficoRepository.save({
      idDeportista: 1,
      nombres: faker.name.firstName(),
      apellidos: faker.name.lastName(),
      paisNacimiento: faker.address.countryCode(),
      ciudadNacimiento: faker.address.cityName(),
      tipoIdentificacion: 1,
      numeroIdentificacion: faker.datatype.number(1000000),
      genero: Genero.MASCULINO,
      fechaNacimiento: faker.date.birthdate(),
      peso: faker.datatype.float({ max: 150 }),
      estatura: faker.datatype.float({ max: 200 }),
      paisResidencia: faker.address.countryCode(),
      ciudadResidencia: faker.address.cityName(),
    });
  };

  it('El servicio de perfil demográfico debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('findByDeportistaId debe retornar los datos del perfil demografico a partir de un id de deportista suministrado', async () => {
    const perfilDemograficoAlmacenado: PerfilDemograficoEntity =
      await service.findByDeportistaId(perfilDemografico.idDeportista);
    expect(perfilDemograficoAlmacenado).not.toBeNull();
    expect(perfilDemograficoAlmacenado.nombres).toEqual(
      perfilDemografico.nombres,
    );
    expect(perfilDemograficoAlmacenado.apellidos).toEqual(
      perfilDemografico.apellidos,
    );
    expect(perfilDemograficoAlmacenado.paisNacimiento).toEqual(
      perfilDemografico.paisNacimiento,
    );
    expect(perfilDemograficoAlmacenado.ciudadNacimiento).toEqual(
      perfilDemografico.ciudadNacimiento,
    );
    expect(perfilDemograficoAlmacenado.tipoIdentificacion).toEqual(
      perfilDemografico.tipoIdentificacion,
    );
    expect(perfilDemograficoAlmacenado.numeroIdentificacion).toEqual(
      perfilDemografico.numeroIdentificacion,
    );
    expect(perfilDemograficoAlmacenado.genero).toEqual(
      perfilDemografico.genero,
    );
    expect(perfilDemograficoAlmacenado.fechaNacimiento).toEqual(
      perfilDemografico.fechaNacimiento,
    );
    expect(perfilDemograficoAlmacenado.peso).toEqual(perfilDemografico.peso);
    expect(perfilDemograficoAlmacenado.estatura).toEqual(
      perfilDemografico.estatura,
    );
    expect(perfilDemograficoAlmacenado.paisResidencia).toEqual(
      perfilDemografico.paisResidencia,
    );
    expect(perfilDemograficoAlmacenado.ciudadResidencia).toEqual(
      perfilDemografico.ciudadResidencia,
    );
  });

  it('findByDeportistaId debe lanzar una excepción para un id de un deportista que no tenga datos de perfil demográfico', async () => {
    await expect(() => service.findByDeportistaId(0)).rejects.toHaveProperty(
      'message',
      'No se encontró un perfil demográfico para el id de deportista suministrado',
    );
  });

  it('create debe almacenar un nuevo perfil deportivo', async () => {
    let perfilDemograficoNuevo: PerfilDemograficoEntity = {
      id: -1,
      idDeportista: 2,
      nombres: faker.name.firstName(),
      apellidos: faker.name.lastName(),
      paisNacimiento: faker.address.countryCode(),
      ciudadNacimiento: faker.address.cityName(),
      tipoIdentificacion: 1,
      numeroIdentificacion: faker.datatype.number(1000000),
      genero: Genero.MASCULINO,
      fechaNacimiento: faker.date.birthdate(),
      peso: faker.datatype.float({ max: 150 }),
      estatura: faker.datatype.float({ max: 200 }),
      paisResidencia: faker.address.countryCode(),
      ciudadResidencia: faker.address.cityName(),
    };

    perfilDemograficoNuevo = await service.create(perfilDemograficoNuevo);
    expect(perfilDemograficoNuevo).not.toBeNull();
    const perfilDemograficoAlmacenado: PerfilDemograficoEntity =
      await service.findByDeportistaId(perfilDemograficoNuevo.idDeportista);
    expect(perfilDemograficoAlmacenado).not.toBeNull();
    expect(perfilDemograficoAlmacenado.nombres).toEqual(
      perfilDemograficoNuevo.nombres,
    );
    expect(perfilDemograficoAlmacenado.apellidos).toEqual(
      perfilDemograficoNuevo.apellidos,
    );
    expect(perfilDemograficoAlmacenado.paisNacimiento).toEqual(
      perfilDemograficoNuevo.paisNacimiento,
    );
    expect(perfilDemograficoAlmacenado.ciudadNacimiento).toEqual(
      perfilDemograficoNuevo.ciudadNacimiento,
    );
    expect(perfilDemograficoAlmacenado.tipoIdentificacion).toEqual(
      perfilDemograficoNuevo.tipoIdentificacion,
    );
    expect(perfilDemograficoAlmacenado.numeroIdentificacion).toEqual(
      perfilDemograficoNuevo.numeroIdentificacion,
    );
    expect(perfilDemograficoAlmacenado.genero).toEqual(
      perfilDemograficoNuevo.genero,
    );
    expect(perfilDemograficoAlmacenado.fechaNacimiento).toEqual(
      perfilDemograficoNuevo.fechaNacimiento,
    );
    expect(perfilDemograficoAlmacenado.peso).toEqual(
      perfilDemograficoNuevo.peso,
    );
    expect(perfilDemograficoAlmacenado.estatura).toEqual(
      perfilDemograficoNuevo.estatura,
    );
    expect(perfilDemograficoAlmacenado.paisResidencia).toEqual(
      perfilDemograficoNuevo.paisResidencia,
    );
    expect(perfilDemograficoAlmacenado.ciudadResidencia).toEqual(
      perfilDemograficoNuevo.ciudadResidencia,
    );
  });

  it('create debe lanzar una excepción para un id de deportista que ya haya sido almacenado', async () => {
    const perfilDemograficoNuevo: PerfilDemograficoEntity = {
      id: -1,
      idDeportista: 1,
      nombres: faker.name.firstName(),
      apellidos: faker.name.lastName(),
      paisNacimiento: faker.address.countryCode(),
      ciudadNacimiento: faker.address.cityName(),
      tipoIdentificacion: 1,
      numeroIdentificacion: faker.datatype.number(1000000),
      genero: Genero.MASCULINO,
      fechaNacimiento: faker.date.birthdate(),
      peso: faker.datatype.float({ max: 150 }),
      estatura: faker.datatype.float({ max: 200 }),
      paisResidencia: faker.address.countryCode(),
      ciudadResidencia: faker.address.cityName(),
    };
    await expect(() =>
      service.create(perfilDemograficoNuevo),
    ).rejects.toHaveProperty(
      'message',
      `Ya existe un perfil demográfico asociado al id ${perfilDemograficoNuevo.idDeportista}`,
    );
  });

  it('update debe modificar los datos de un perfil demográfico', async () => {
    perfilDemografico.nombres = faker.name.firstName();
    perfilDemografico.apellidos = faker.name.lastName();
    const perfilDemograficoActualizado = await service.update(
      perfilDemografico.idDeportista,
      perfilDemografico,
    );
    expect(perfilDemograficoActualizado).not.toBeNull();
    const perfilDemograficoAlmacenado: PerfilDemograficoEntity =
      await service.findByDeportistaId(perfilDemografico.idDeportista);
    expect(perfilDemograficoAlmacenado).not.toBeNull();
    expect(perfilDemograficoAlmacenado.nombres).toEqual(
      perfilDemografico.nombres,
    );
    expect(perfilDemograficoAlmacenado.apellidos).toEqual(
      perfilDemografico.apellidos,
    );
    expect(perfilDemograficoAlmacenado.paisNacimiento).toEqual(
      perfilDemografico.paisNacimiento,
    );
    expect(perfilDemograficoAlmacenado.ciudadNacimiento).toEqual(
      perfilDemografico.ciudadNacimiento,
    );
    expect(perfilDemograficoAlmacenado.tipoIdentificacion).toEqual(
      perfilDemografico.tipoIdentificacion,
    );
    expect(perfilDemograficoAlmacenado.numeroIdentificacion).toEqual(
      perfilDemografico.numeroIdentificacion,
    );
    expect(perfilDemograficoAlmacenado.genero).toEqual(
      perfilDemografico.genero,
    );
    expect(perfilDemograficoAlmacenado.fechaNacimiento).toEqual(
      perfilDemografico.fechaNacimiento,
    );
    expect(perfilDemograficoAlmacenado.peso).toEqual(perfilDemografico.peso);
    expect(perfilDemograficoAlmacenado.estatura).toEqual(
      perfilDemografico.estatura,
    );
    expect(perfilDemograficoAlmacenado.paisResidencia).toEqual(
      perfilDemografico.paisResidencia,
    );
    expect(perfilDemograficoAlmacenado.ciudadResidencia).toEqual(
      perfilDemografico.ciudadResidencia,
    );
  });

  it('update debe lanzar una excepción para un id de deportista no tiene un perfil demográfico registrado y se está intentando actualizar', async () => {
    perfilDemografico.nombres = faker.name.firstName();
    perfilDemografico.apellidos = faker.name.lastName();
    await expect(() =>
      service.update(-1, perfilDemografico),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró un perfil demográfico para el id de deportista suministrado',
    );
  });

  it('delete debe eliminar los datos de un perfil demográfico', async () => {
    await service.delete(perfilDemografico.idDeportista);
    await expect(() =>
      service.findByDeportistaId(perfilDemografico.idDeportista),
    ).rejects.toHaveProperty(
      'message',
      'No se encontró un perfil demográfico para el id de deportista suministrado',
    );
  });

  it('update debe lanzar una excepción para un id de deportista no tiene un perfil deportivo registrado y se está intentando eliminar', async () => {
    await expect(() => service.delete(-1)).rejects.toHaveProperty(
      'message',
      'No se encontró un perfil demográfico para el id de deportista suministrado',
    );
  });
});
