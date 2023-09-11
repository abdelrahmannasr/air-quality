import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { Weather, WeatherRepository } from './data';

describe('AppService', () => {
  let appService: AppService;
  let weatherRepositoryMock: WeatherRepository;

  beforeEach(async () => {
    weatherRepositoryMock = {
      getAirQualityByLocation: jest.fn(),
      findAllWeather: jest.fn(),
      addWeather: jest.fn(),
    } as unknown as WeatherRepository;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: WeatherRepository,
          useValue: weatherRepositoryMock,
        },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  describe('getAirQualityByLocation', () => {
    it('should return air quality data', async () => {
      const latitude = 123;
      const longitude = 456;

      const mockWeatherData: Weather = {
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
        .spyOn(weatherRepositoryMock, 'getAirQualityByLocation')
        .mockResolvedValue(mockWeatherData);

      const result = await appService.getAirQualityByLocation(
        latitude,
        longitude,
      );

      expect(result).toEqual(mockWeatherData);
    });

    it('should handle errors and throw InternalServerErrorException', async () => {
      const latitude = 123;
      const longitude = 456;

      (
        weatherRepositoryMock.getAirQualityByLocation as jest.Mock
      ).mockRejectedValue(new Error());

      await expect(
        appService.getAirQualityByLocation(latitude, longitude),
      ).rejects.toThrow();
    });
  });

  describe('getAllWeather', () => {
    it('should return an array of weather data', async () => {
      const mockWeatherArray: Weather[] = [
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

      jest
        .spyOn(weatherRepositoryMock, 'findAllWeather')
        .mockResolvedValue(mockWeatherArray);

      const result = await appService.getAllWeather();

      expect(result).toEqual(mockWeatherArray);
    });

    it('should handle errors and throw InternalServerErrorException', async () => {
      (weatherRepositoryMock.findAllWeather as jest.Mock).mockRejectedValue(
        new Error(),
      );

      await expect(appService.getAllWeather()).rejects.toThrow();
    });
  });
});
