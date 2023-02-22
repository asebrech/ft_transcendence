import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Room, Server } from "colyseus";
import { MyRoom } from "./game/rooms/MyRoom";

async function bootstrap() 
{
  const app = await NestFactory.create(AppModule);
  const gameServer = new Server();

  gameServer.define("my_room", MyRoom);
  
// attach Colyseus into the existing http server from NestJS
  gameServer.attach({ server: app.getHttpServer() });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
