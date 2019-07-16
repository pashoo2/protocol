export class HttpResponseError {
  constructor(
    public code: number,
    public message: string,
    public error?: Error
  ) {}
}
