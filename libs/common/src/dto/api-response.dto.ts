export class ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    timestamp?: Date;
    path?: string;
    [key: string]: any;
  };
  errors?: any[];

  constructor(partial: Partial<ApiResponse<T>>) {
    Object.assign(this, partial);
    this.meta = {
      timestamp: new Date(),
      ...this.meta,
    };
  }
}
