import { RESPONSE_MESSAGE } from '@/decorator/customize';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
export interface Response<T> {
  statusCode: number;
  message?: string;
  data: any;
  meta?: {
    total: number;
    page: number;
    totalPage: number;
    pageSize: number;
  }
}
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  Response<T>
> {
  constructor(private reflector: Reflector) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => {
        const {meta, ...dataTemp} = data
        const responseData: Response<T> = {
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: this.reflector.get<string>(RESPONSE_MESSAGE, context.getHandler()) || '',
          data: meta ? dataTemp.data : dataTemp,
        }

        if (meta) {
          responseData.meta = meta;
        }

        return responseData
      }
    ));
  }
}
