import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { knife4jSetup } from 'nestjs-knife4j-plus'
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService)

  // app.useGlobalPipes(new ValidationPipe({
  //   whitelist: true, // 自动剔除 DTO 中未定义的字段
  //   transform: true, // 自动将请求数据转换为 DTO 实例
  //   transformOptions: { enableImplicitConversion: true }, // 隐式类型转换
  // }));

  app.enableCors({
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // 生成api文档, swagger
  const config = new DocumentBuilder()
    .setTitle('zero-cost-api')
    .setDescription('api文档')
    .setVersion('0.1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  knife4jSetup(app, [
    {
      name: '2.0 version',
      url: `/api-json`,
    },
  ])

  await app.listen(configService.get('http.port', 3000));
}
bootstrap();
