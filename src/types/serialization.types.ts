export interface ISerializer {
  stringify(o: Record<string | number, any>): string;
  parse(data: string): any;
}
