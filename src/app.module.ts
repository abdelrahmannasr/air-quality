import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Constants, Weather, WeatherRepository, WeatherSchema } from './data';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: Constants.MONGODB_URI,
      }),
    }),
    MongooseModule.forFeature([{ name: Weather.name, schema: WeatherSchema }]),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService, WeatherRepository],
})
export class AppModule {}
