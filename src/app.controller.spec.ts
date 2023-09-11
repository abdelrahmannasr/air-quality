import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Weather } from './data';
import { Logger } from '@nestjs/common';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getAirQualityByLocation: jest.fn(),
            getAllWeather: jest.fn(),
          },
        },
        Logger,
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  it('should return air quality by location', async () => {
    const locationDto = {
      latitude: 123.456,
      longitude: 789.012,
    };

    const expectedWeather: Weather = {
      city: 'Paris',
      state: 'Ile-de-France',
      country: 'France',
      location: {
        type: 'Point',
        coordinates: [2.351666, 48.859425],
      },
      current: {
        pollution: {
          ts: '2023-09-11T00:00:00.000Z',
          aqius: 61,
          mainus: 'p2',
          aqicn: 31,
          maincn: 'p1',
        },
        weather: {
          ts: '2023-09-11T00:00:00.000Z',
          tp: 23,
          pr: 1014,
          hu: 71,
          ws: 2.06,
          wd: 340,
          ic: '01n',
        },
      },
      createdAt: new Date(),
    };

    jest
      .spyOn(appService, 'getAirQualityByLocation')
      .mockResolvedValue(expectedWeather);

    const result = await appController.getAirQualityByLocation(locationDto);

    expect(result).toEqual(expectedWeather);
  });

  it('should handle errors and return InternalServerError', async () => {
    const locationDto = {
      latitude: 123.456,
      longitude: 789.012,
    };

    (appService.getAirQualityByLocation as jest.Mock).mockRejectedValue(
      new Error(),
    );

    await expect(
      appController.getAirQualityByLocation(locationDto),
    ).rejects.toThrow();
  });

  it('should return an array of Weather objects', async () => {
    const weatherData: Weather[] = [
      {
        city: 'Paris',
        state: 'Ile-de-France',
        country: 'France',
        location: {
          type: 'Point',
          coordinates: [2.351666, 48.859425],
        },
        current: {
          pollution: {
            ts: '2023-09-11T00:00:00.000Z',
            aqius: 61,
            mainus: 'p2',
            aqicn: 31,
            maincn: 'p1',
          },
          weather: {
            ts: '2023-09-11T00:00:00.000Z',
            tp: 23,
            pr: 1014,
            hu: 71,
            ws: 2.06,
            wd: 340,
            ic: '01n',
          },
        },
        createdAt: new Date(),
      },
    ];
    jest.spyOn(appService, 'getAllWeather').mockResolvedValue(weatherData);

    const result = await appController.getAllWeather();

    expect(result).toEqual(weatherData);
  });

  it('should handle errors and throw InternalServerErrorException', async () => {
    (appService.getAllWeather as jest.Mock).mockRejectedValue(new Error());
    await expect(appController.getAllWeather()).rejects.toThrow();
  });
});
