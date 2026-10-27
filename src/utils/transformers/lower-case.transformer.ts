import { TransformFnParams } from 'class-transformer';

export const lowerCaseTransformer = ({ value }: TransformFnParams): unknown =>
  typeof value === 'string' ? value.toLowerCase().trim() : value;
