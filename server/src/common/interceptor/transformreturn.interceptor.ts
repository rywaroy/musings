import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const PASSTHROUGH_PATHS = ['/api/base/content'];

const transformValue = (data: any) => {
  return {
    data,
    code: 0,
    message: '请求成功',
    status: 200,
  };
};

// 处理统一成功返回值
@Injectable()
export class TransformReturnInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const host = context.switchToHttp();
    const request = host.getRequest();
    const requestPath = request?.path ?? request?.url;

    if (requestPath && PASSTHROUGH_PATHS.includes(requestPath)) {
      return next.handle();
    }

    return next.handle().pipe(map(transformValue));
  }
}
