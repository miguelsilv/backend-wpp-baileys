
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { SentryExceptionCaptured } from '@sentry/nestjs';
import * as Sentry from "@sentry/node";
@Catch()
export class CatchAllExceptionFilter implements ExceptionFilter {

    @SentryExceptionCaptured()
    catch(exception: any, host: ArgumentsHost): void {
        
        Sentry.captureException(exception);

        if (exception instanceof HttpException) {
            const request = host.switchToHttp().getRequest();
            const { body, headers, url, method } = request;
            Sentry.captureMessage(`${method} ${url}`, {
                level: 'error',
                extra: { body, headers, url, method }
            });
            return host.switchToHttp().getResponse().status(exception.getStatus()).json(exception.getResponse());
        }

        throw exception;
    }
}
