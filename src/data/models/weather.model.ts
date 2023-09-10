import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { LocationType } from '../common';
import { Expose } from 'class-transformer';

@Schema()
export class Weather {
  @Prop({ required: true })
  @Expose()
  city: string;

  @Prop({ required: true })
  @Expose()
  state: string;

  @Prop({ required: true })
  @Expose()
  country: string;

  @Prop({
    type: {
      type: String,
      enum: LocationType,
      required: true,
      default: LocationType.Point,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  })
  @Expose()
  location: {
    type: string;
    coordinates: [number, number];
  };

  @Prop({
    type: {
      pollution: {
        ts: String,
        aqius: Number,
        mainus: String,
        aqicn: Number,
        maincn: String,
      },
      weather: {
        ts: String,
        tp: Number,
        pr: Number,
        hu: Number,
        ws: Number,
        wd: Number,
        ic: String,
      },
    },
    required: true,
  })
  @Expose()
  current: {
    pollution: {
      ts: string;
      aqius: number;
      mainus: string;
      aqicn: number;
      maincn: string;
    };
    weather: {
      ts: string;
      tp: number;
      pr: number;
      hu: number;
      ws: number;
      wd: number;
      ic: string;
    };
  };

  @Prop({ default: Date.now })
  createdAt: Date;
}

export type WeatherDocument = Weather & Document;

export const WeatherSchema = SchemaFactory.createForClass(Weather);
