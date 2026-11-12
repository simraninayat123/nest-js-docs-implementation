import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipeOptions,
} from '@nestjs/common';
import { i18nValidationErrorFactory } from 'nestjs-i18n';

const VALIDATION_NAMESPACE = 'validation';

function withTranslationKeys(errors: ValidationError[]): ValidationError[] {
  return errors.map((error) => ({
    ...error,
    children: withTranslationKeys(error.children ?? []),
    constraints: Object.fromEntries(
      Object.entries(error.constraints ?? {}).map(([name, message]) => [
        name,
        message.startsWith(`${VALIDATION_NAMESPACE}.`)
          ? message
          : `${VALIDATION_NAMESPACE}.${name}`,
      ]),
    ),
  }));
}

function generateErrors(errors: ValidationError[]): Record<string, unknown> {
  return errors.reduce(
    (accumulator, currentValue) => ({
      ...accumulator,
      [currentValue.property]:
        (currentValue.children?.length ?? 0) > 0
          ? generateErrors(currentValue.children ?? [])
          : Object.values(currentValue.constraints ?? {}).join(', '),
    }),
    {},
  );
}

const validationOptions: ValidationPipeOptions = {
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  exceptionFactory: (errors: ValidationError[]) =>
    new UnprocessableEntityException({
      status: HttpStatus.UNPROCESSABLE_ENTITY,
      errors: generateErrors(
        i18nValidationErrorFactory(withTranslationKeys(errors)).errors,
      ),
    }),
};

export default validationOptions;
