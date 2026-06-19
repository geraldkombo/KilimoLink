import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, { cors: true });
    app.use(helmet());
    app.setGlobalPrefix('api/v1');

    // Root route for Render health checks
    const expressApp = app.getHttpAdapter().getInstance();
    expressApp.get('/', (_req: any, res: any) => {
      res.json({ status: 'ok', service: 'KilimoLink API', version: '1.0.0' });
    });
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
      })
    );

    const config = new DocumentBuilder()
      .setTitle('KilimoLink Platform API')
      .setVersion('1.0.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);

    await app.listen(process.env.PORT ? Number(process.env.PORT) : 3000);
    console.log(`KilimoLink API running on port ${process.env.PORT || 3000}`);
  } catch (err) {
    console.error('Failed to start KilimoLink API:', err);
    process.exit(1);
  }
}

bootstrap();
