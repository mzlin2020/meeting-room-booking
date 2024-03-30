import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  // 自定义错误返回格式
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response.statusCode = exception.getStatus();

    const res = exception.getResponse() as { message: string[] };

    response.json({
      code: exception.getStatus(),
      message: 'fail',
      data: res?.message?.join ? res.message.join(',') : exception.message,
    });
  }
}
