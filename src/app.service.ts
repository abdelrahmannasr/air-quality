import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Constants, Weather, WeatherRepository } from './data';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AppService {
  private logger = new Logger('AppService', { timestamp: true });

  constructor(private weatherRepository: WeatherRepository) {}

  public async getAirQualityByLocation(
    latitude: number,
    longitude: number,
  ): Promise<Weather> {
    return new Promise(async (resolve, reject) => {
      try {
        return resolve(
          this.weatherRepository.getAirQualityByLocation(latitude, longitude),
        );
      } catch (error) {
        this.logger.error(error);
        return reject(new InternalServerErrorException());
      }
    });
  }

  public async getAllWeather() {
    const allWeather = await this.weatherRepository.findAllWeather();
    return allWeather;
  }

  @Cron(`${Constants.INTERVAL_SECONDS} * * * * *`)
  private async getUpdatedAirQuality() {
    this.logger.log(`Cron Job has been started`);
    const weather = await this.getAirQualityByLocation(
      Constants.LOCATION_LATITUDE,
      Constants.LOCATION_LONGITUDE,
    );
    await this.weatherRepository.addWeather(weather);
    this.logger.log(`Cron Job has been finished`);
  }
}
