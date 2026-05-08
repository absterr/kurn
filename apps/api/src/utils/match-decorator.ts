import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

@ValidatorConstraint({ name: "Match", async: false })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;
    const relatedValue = (args.object as Record<string, unknown>)[
      relatedPropertyName
    ];
    return value === relatedValue;
  }
}

export default function Match(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      target: (object as Record<string, unknown>).constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
}
