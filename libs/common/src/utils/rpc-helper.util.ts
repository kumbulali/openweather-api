import { firstValueFrom, catchError, Observable } from 'rxjs';
import { RpcErrorHandler } from './rpc-error-handler.util';

export async function handleRpcCall<T>(
  call: Observable<T>,
  errorHandler?: (error: any) => never,
): Promise<T> {
  return firstValueFrom(
    call.pipe(
      catchError((error) => {
        if (errorHandler) {
          throw errorHandler(error);
        }
        throw RpcErrorHandler.handle(error);
      }),
    ),
  );
}
