import { monitor } from '@colyseus/monitor';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  monitor() {
    return monitor();
  }
  getHello(): object {
    return {title: 'Hello There say obiwan!'};
  }
}
