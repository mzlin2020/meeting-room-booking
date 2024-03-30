import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from './format-response.interceptor';
import { InvokeRecordInterceptor } from './invoke-record.interceptor';
import { CustomExceptionFilter } from './custom-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局启用参数校验
  app.useGlobalPipes(new ValidationPipe());

  // 全局响应处理
  app.useGlobalInterceptors(new FormatResponseInterceptor());

  // 自定义错误响应格式
  app.useGlobalFilters(new CustomExceptionFilter());

  // 接口访问日志记录
  app.useGlobalInterceptors(new InvokeRecordInterceptor());

  const configService = app.get(ConfigService);
  await app.listen(configService.get('nest_server_port'));
}
bootstrap();
