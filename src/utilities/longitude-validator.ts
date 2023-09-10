import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isLongitude', async: false })
export class IsLongitude implements ValidatorConstraintInterface {
  validate(value: any) {
    const longitude = parseFloat(value);
    if (isNaN(longitude)) {
      return false;
    }
    return longitude >= -180 && longitude <= 180;
  }

  defaultMessage() {
    return 'Longitude must be a valid value between -180 and 180 degrees.';
  }
}
