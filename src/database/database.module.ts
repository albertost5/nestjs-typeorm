import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DatabaseService } from './database.service';
import { TypeOrmConfigService } from './typeorm-config.service';

console.log('LOADING APP DATABASE MODULE.. ');

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        const dataSource = new DataSource(options).initialize();
        return dataSource;
      },
    }),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}

// @Module({
//   imports: [
//     TypeOrmModule.forRootAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: async (configService: ConfigService) => ({
//         type: 'postgres',
//         host: configService.get('DB_HOST'),
//         port: +configService.get('DB_PORT'),
//         username: configService.get('DB_USER'),
//         password: configService.get('DB_PASSWORD'),
//         database: configService.get('DB_NAME'),
//         autoLoadEntities: true,
//         synchronize: true,
//       }),
//     }),
//   ],
//   providers: [DatabaseService],
//   exports: [DatabaseService],
// })
// export class DatabaseModule {}
