import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { DrizzleQueryError } from 'drizzle-orm';

@Catch(DrizzleQueryError)
export class DrizzleExceptionFilter implements ExceptionFilter {
  catch(exception: DrizzleQueryError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    const cause: any = exception.cause;
    console.log(exception);

    if (cause?.code === '23505') {
      return response.status(400).json({
        success: false,
        message: 'Duplicate value found, ' + cause.message,
      });
    }

    return response.status(500).json({
      success: false,
      message: 'Database error, ' + exception.message,
    });
  }
}
