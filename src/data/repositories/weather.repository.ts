import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Constants } from '../common';
import { HttpService } from '@nestjs/axios';
import { Mapper } from '../../utilities';
import { InjectModel } from '@nestjs/mongoose';
import { Weather, WeatherDocument } from '../models';
import { Model } from 'mongoose';

@Injectable()
export class WeatherRepository {
  private logger = new Logger('WeatherRepository', { timestamp: true });
  constructor(
    @InjectModel(Weather.name)
    private readonly weatherModel: Model<WeatherDocument>,
    private httpService: HttpService,
  ) {}

  public async addWeather(data: Weather): Promise<Weather> {
    return await this.weatherModel.create(data);
  }

  public async findAllWeather(): Promise<Weather[]> {
    return this.weatherModel.find().exec();
  }

  public async getAirQualityByLocation(
    latitude: number,
    longitude: number,
  ): Promise<Weather> {
    const url = `${Constants.URL_EXTERNAL_API}${Constants.NEAREST_CITY}?lat=${latitude}&lon=${longitude}&key=${Constants.API_KEY}`;
    return new Promise(async (resolve, reject) => {
      try {
        this.httpService.get(url).subscribe((response) => {
          if (!response.data)
            reject(
              new HttpException(`Location is not found`, HttpStatus.NOT_FOUND),
            );
          return resolve(Mapper.toClient(Weather, response.data.data));
        });
      } catch (error) {
        this.logger.error('Error fetching object:', error.message);
        return reject(new InternalServerErrorException());
      }
    });
  }
}
