import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    console.log(`Estamos rodando na porta: ${process.env.PORT}`);

    return 'Hello World!';
  }
}
