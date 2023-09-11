import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { WeatherRepository } from './weather.repository';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Weather } from '../models';
import { Constants } from '../common';

// Mock the Mongoose model and HttpService
const mockWeatherModel = {
  create: jest.fn(),
  find: jest.fn(),
};

const mockHttpService = {
  get: jest.fn(),
};

describe('WeatherRepository', () => {
  let weatherRepository: WeatherRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherRepository,
        {
          provide: getModelToken(Weather.name),
          useValue: mockWeatherModel,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    weatherRepository = module.get<WeatherRepository>(WeatherRepository);
  });

  it('should be defined', () => {
    expect(weatherRepository).toBeDefined();
  });

  describe('addWeather', () => {
    it('should add weather data to the database', async () => {
      const weatherData: Weather = {
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
      mockWeatherModel.create.mockReturnValue(weatherData);

      const result = await weatherRepository.addWeather(weatherData);

      expect(result).toEqual(weatherData);
      expect(mockWeatherModel.create).toHaveBeenCalledWith(weatherData);
    });
  });

  describe('findAllWeather', () => {
    it('should return all weather data from the database', async () => {
      const mockWeatherData = [
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
      mockWeatherModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockWeatherData),
      });

      const result = await weatherRepository.findAllWeather();

      expect(result).toEqual(mockWeatherData);
      expect(mockWeatherModel.find).toHaveBeenCalled();
    });
  });

  describe('getAirQualityByLocation', () => {
    it('should fetch air quality data for a location', async () => {
      const latitude = 123.456;
      const longitude = 789.012;
      const mockResponse = {
        data: {
          data: {
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
          },
        },
      };
      mockHttpService.get.mockReturnValue(of(mockResponse));

      const result = await weatherRepository.getAirQualityByLocation(
        latitude,
        longitude,
      );

      const url = `${Constants.URL_EXTERNAL_API}${Constants.NEAREST_CITY}?lat=${latitude}&lon=${longitude}&key=${Constants.API_KEY}`;

      expect(result).toBeDefined();
      expect(mockHttpService.get).toHaveBeenCalledWith(url);
    });

    it('should handle HTTP errors by throwing an HttpException', async () => {
      const latitude = 123.456;
      const longitude = 789.012;
      mockHttpService.get.mockReturnValue(new Error('HTTP error'));

      try {
        await weatherRepository.getAirQualityByLocation(latitude, longitude);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      }
    });

    it('should handle missing data by throwing a NotFound HttpException', async () => {
      const latitude = 123.456;
      const longitude = 789.012;
      const mockResponse = {
        data: {},
      };
      mockHttpService.get.mockReturnValue(of(mockResponse));

      try {
        await weatherRepository.getAirQualityByLocation(latitude, longitude);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.getStatus()).toBe(HttpStatus.NOT_FOUND);
        expect(error.getResponse()).toBe('Location is not found');
      }
    });
  });
});
