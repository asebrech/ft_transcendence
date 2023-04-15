import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './middleware/auth.middleware';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot({
			type: 'postgres',
			url: process.env.DATABASE_URL,
			autoLoadEntities: true,
			synchronize: true
		}),
		UserModule,
		AuthModule,
		ChatModule
	],
	controllers: [AppController],
	providers: [
		Ball_dataService, AppService],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(AuthMiddleware)
			.exclude(
				{ path: '/api/users', method: RequestMethod.POST },
				{ path: '/api/users/login', method: RequestMethod.POST },
				{ path: '/api/users/api-login', method: RequestMethod.POST },
				{ path: '/api/users/qr-code', method: RequestMethod.GET },
				{ path: '/api/users/verify', method: RequestMethod.POST },
				{ path: '/api/users/check-email', method: RequestMethod.GET },
				{ path: '/api/colyseus', method: RequestMethod.GET },
			)
			.forRoutes('')
			.apply((req, res, next) => {
				res.setHeader('Access-Control-Allow-Origin', '*');
				res.setHeader(
					'Access-Control-Allow-Methods',
					'GET, POST, PUT, DELETE, OPTIONS',
				);
				res.setHeader(
					'Access-Control-Allow-Headers',
					'Origin, X-Requested-With, Content-Type, Accept, Authorization',
				);
				next();
			})
			.forRoutes('*');
	}
}
