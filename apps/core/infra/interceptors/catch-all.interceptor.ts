
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { SentryExceptionCaptured } from '@sentry/nestjs';

@Catch()
export class CatchAllExceptionFilter implements ExceptionFilter {


  @SentryExceptionCaptured()
  catch(exception: any, host: ArgumentsHost): void {
    // your implementation here
  }
}
