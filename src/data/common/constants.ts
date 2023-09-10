import * as dotenv from 'dotenv';

export class Constants {
  public static CONFIG = dotenv.config();
  // API Routes
  public static API_VERSION = 'v0.0.1';
  public static API_PREFIX = 'api';
  public static APP_VERSION = 'v0.0.1';

  // Server Configurations
  public static URL_EXTERNAL_API =
    process.env.URL_EXTERNAL_API || 'http://api.airvisual.com/';
  public static NEAREST_CITY = process.env.NEAREST_CITY || 'v2/nearest_city';
  public static API_KEY = process.env.API_KEY || undefined;
  public static MONGODB_URI = process.env.MONGODB_URI || undefined;
  public static PORT = process.env.PORT || '3001';

  // CRON Configurations
  public static INTERVAL_SECONDS = process.env.INTERVAL_SECONDS || 45;
  public static LOCATION_LATITUDE = +process.env.LOCATION_LATITUDE || 48.856613;
  public static LOCATION_LONGITUDE =
    +process.env.LOCATION_LONGITUDE || 2.352222;

  // Swagger
  public static API_TITLE = 'Managing Air Quality API';
  public static API_DESCRIPTION =
    'Managing air quality API provide the easy way to integrate and handle air quality logic and model with hight quality and performance';
  public static API_TAG = 'Docs';
  public static API_AUTH_TYPE = 'http';

  // Paths
  public static AIR_QUALITY_PATH = [
    `${Constants.API_VERSION}/${Constants.API_PREFIX}/airQuality`,
  ];
  public static AIR_QUALITY_TAG = 'Air Quality';
  public static GET_AIR_QUALITY_BY_LOCATION = 'by-location';
  public static GET_ALL = 'get-all';
}
