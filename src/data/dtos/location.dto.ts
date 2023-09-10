import { IsLatitude, IsLongitude, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LocationDto {
  @ApiProperty({
    example: '48.856613',
    description: 'Location Latitude',
    required: true,
  })
  @IsNotEmpty()
  @IsLatitude()
  latitude: number;

  @ApiProperty({
    example: '2.352222',
    description: 'Location Longitude',
    required: true,
  })
  @IsNotEmpty()
  @IsLongitude()
  longitude: number;
}
