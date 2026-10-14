export interface Cat {
  name: string;
  age: number;
}
export interface CatsRepository {
  findAll(): Cat[];
}
export abstract class CatsProvider {
  abstract findAll(): Cat[];
}
