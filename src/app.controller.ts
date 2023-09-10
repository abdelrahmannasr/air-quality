import {
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Constants, LocationDto, Weather } from './data';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller(Constants.AIR_QUALITY_PATH)
export class AppController {
  private logger = new Logger('AppController', { timestamp: true });

  constructor(private readonly appService: AppService) {}

  @Get(Constants.GET_AIR_QUALITY_BY_LOCATION)
  @ApiOperation({
    summary: 'Retrieving air quality for specific latitude and longitude',
    tags: [Constants.AIR_QUALITY_TAG],
  })
  @ApiResponse({
    status: 200,
    description: 'Air quality has been retrieved successfully',
    type: Weather,
  })
  getAirQualityByLocation(
    @Query(ValidationPipe) locationDto: LocationDto,
  ): Promise<Weather> {
    try {
      return this.appService.getAirQualityByLocation(
        locationDto.latitude,
        locationDto.longitude,
      );
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }

  @Get(Constants.GET_ALL)
  @ApiOperation({
    summary: 'Retrieving all air qualities',
    tags: [Constants.AIR_QUALITY_TAG],
  })
  @ApiResponse({
    status: 200,
    description: 'Air qualities has been retrieved successfully',
    type: Weather,
  })
  getAllWeather(): Promise<Weather[]> {
    try {
      return this.appService.getAllWeather();
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException();
    }
  }
}
