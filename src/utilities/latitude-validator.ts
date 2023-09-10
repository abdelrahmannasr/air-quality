import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isLatitude', async: false })
export class IsLatitude implements ValidatorConstraintInterface {
  validate(value: any) {
    const latitude = parseFloat(value);
    if (isNaN(latitude)) {
      return false;
    }
    return latitude >= -90 && latitude <= 90;
  }

  defaultMessage() {
    return 'Latitude must be a valid value between -90 and 90 degrees.';
  }
}
