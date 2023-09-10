import { Logger } from '@nestjs/common';
import {
  ClassConstructor,
  instanceToPlain,
  plainToClass,
} from 'class-transformer';

export class Mapper {
  static logger = new Logger('Mapper', { timestamp: true });

  static toClient<T>(classType: ClassConstructor<T>, fromObject: any): T {
    const serializeObject = instanceToPlain(fromObject);
    const mapped = plainToClass(classType, serializeObject, {
      strategy: 'exposeAll',
      excludeExtraneousValues: true,
    });
    this.logger.debug({
      serializeObject: serializeObject,
      mapped: mapped,
    });

    return mapped;
  }

  static toClientList<T>(
    classType: ClassConstructor<T>,
    fromObjectList: any[],
  ): T[] {
    const returnList: T[] = [];
    for (const fromObject of fromObjectList) {
      returnList.push(this.toClient(classType, fromObject));
    }
    return returnList;
  }
}
