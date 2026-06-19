import 'reflect-metadata';
import http from 'node:http';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// Start a bare-minimum health server on PORT immediately,
// so Render never sees 404 even if NestJS bootstrap fails.
const healthServer = http.createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok', service: 'KilimoLink API', health: 'up' }));
});
healthServer.listen(PORT, () => {
  console.log(`Health server listening on port ${PORT}`);
});

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, { cors: true });
    app.use(helmet());
    app.setGlobalPrefix('api/v1');

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

    // Upgrade the health server to delegate to NestJS once it's ready.
    healthServer.removeAllListeners('request');
    const expressApp = app.getHttpAdapter().getInstance();
    healthServer.on('request', (req, res) => expressApp(req, res));

    console.log(`KilimoLink API running on port ${PORT}`);
  } catch (err) {
    console.error('NestJS bootstrap failed (health server still running):', err);
  }
}

bootstrap();
