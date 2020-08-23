import { NestApplicationContext, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { config, Config } from './config/config';
import * as bodyParser from 'body-parser';
import { ValidationError } from 'class-validator';
import { List, Map } from "immutable";
import { BadRequestException, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

function setupSwagger(app: NestExpressApplication, cnf: Config) {
  const commonDescription = 'Non public entry points are protected by JWT token. Valid token must be provided in header "Authorization". Example:\n\n' +
    '> Authorization: Bearer *TOKEN*';

  SwaggerModule.setup(`${cnf.api.path}/docs`, app, SwaggerModule.createDocument(app, new DocumentBuilder()
    .setTitle('Miss World API')
    .setDescription(commonDescription)
    .setVersion(cnf.api.version)
    .setBasePath(cnf.api.path)
    .addBearerAuth()
    .build(), {}));

}

async function bootstrap(cnf: Config) {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.setGlobalPrefix(cnf.api.path);
  app.enableCors();
  app.use(bodyParser.json({ limit: '100mb' }));
  app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
  app.useGlobalPipes(new ValidationPipe(<ValidationPipeOptions>{
    // disableErrorMessages: true,
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    exceptionFactory: errors => {
      let errorsSimple: string[] = [];
      List(errors).forEach((e: ValidationError) => {
        Map(e.constraints).forEach(v => {
          errorsSimple.push(v);
        });
      });
      throw new BadRequestException('Request validation failed.', errorsSimple.join('; '));
    }
  }));

  app.useStaticAssets(cnf.assetsPath);

  setupSwagger(app, cnf);
  await app.listen(cnf.api.port, cnf.api.host);
}
bootstrap(config);
