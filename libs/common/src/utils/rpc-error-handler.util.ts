import {
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
  GatewayTimeoutException,
  ServiceUnavailableException,
  HttpException,
} from '@nestjs/common';
import { Logger } from '@nestjs/common';

export class RpcErrorHandler {
  private static readonly logger = new Logger('RpcErrorHandler');

  static handle(error: any): HttpException {
    if (!error || typeof error !== 'object') {
      this.logger.error('Invalid error object received');
      return new InternalServerErrorException('Unknown error occurred');
    }

    return this.createExceptionFromErrorData(error);
  }

  private static createExceptionFromErrorData(errorData: {
    statusCode?: number;
    code?: string;
    message?: string;
    error?: string;
    errors?: any[];
  }): HttpException {
    const { statusCode, code, message, error: errorMessage } = errorData;
    const finalMessage = message || errorMessage || 'Internal server error';

    switch (code || statusCode) {
      case 'BAD_REQUEST':
      case 'VALIDATION_ERROR':
      case 400:
        return new BadRequestException(finalMessage);

      case 'UNAUTHORIZED':
      case 401:
        return new UnauthorizedException(finalMessage);

      case 'FORBIDDEN':
      case 403:
        return new ForbiddenException(finalMessage);

      case 'NOT_FOUND':
      case 404:
        return new NotFoundException(finalMessage);

      case 'CONFLICT':
      case 'DUPLICATE_ENTRY':
      case 409:
        return new ConflictException(finalMessage);

      case 'TIMEOUT':
      case 'GATEWAY_TIMEOUT':
      case 504:
        return new GatewayTimeoutException(finalMessage);

      case 'SERVICE_UNAVAILABLE':
      case 503:
        return new ServiceUnavailableException(finalMessage);

      default:
        this.logger.error(
          `Unhandled error code: ${code || statusCode}`,
          errorData,
        );
        return new InternalServerErrorException(finalMessage);
    }
  }
}
