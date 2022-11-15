import { Get, Injectable, Res } from '@nestjs/common';
import path from 'path';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
