# inspected

Simple JavaScript object validation

inspected is a small library for validating JavaScript objects against schemas, inspired by the API of [spected](https://github.com/25th-floor/spected).

## Getting Started

### Install inspected:

```
npm i inspected
```

or

```
yarn add inspected
```

### Define a schema:

```javascript
import isRequired from 'inspected/schema/is-required'
import isOptional from 'inspected/schema/is-optional'
import isFunction from 'inspected/schema/is-function'
import isString from 'inspected/schema/is-string'

const schema = {
  name: [[isRequired(isString), 'Name is required.']],
  process: [[isOptional(isFunction), 'Process is an optional function.']],
}
```

> Note that `inspected` comes with a number of useful functions for building schemas in the `schema` folder, or you can define any predicate to validate object properties. See the [spected](https://github.com/25th-floor/spected) documentation for more information.

### Validate an object instance against the schema:

```javascript
import validate from 'inspected/validate'

const validator = validate(schema)

validator({
  name: 'foo',
  process: () => {},
})
//=> { isValid: true, errors: { property: {}, object: {} } }

validator({
  foo: 'bar',
})
//=> { isValid: false, errors: { property: { name: ['Name is required.'], foo: ['Unexpected property.'] }, object: {} } }
```

Validation result:

| Property  | Description                                                                |
| --------- | -------------------------------------------------------------------------- |
| `isValid` | True if the object satisfies the schema and object rules, false otherwise. |
| `errors`  | Object containing any `property` errors and `object` rule errors.          |

### Validate an object instance against object rules

The `validate` function also supports an optional `rules` parameter. This allows the validation of rules which aren't associated with an individual property, but rather rules that affect the entire object instance.

For example:

```javascript
const schema = {
  forename: [[isRequired(isString), 'Forename is required.']],
  surname: [[isRequired(isString), 'Surname is required.']],
}

const rules = {
  forenameSurname: [
    [obj => obj.forename !== obj.surname, 'Forename cannot match surname.'],
  ],
}

const validator = validate(schema, rules)

validator({
  forename: 'foo',
  surname: 'foo',
})
//=> { isValid: false, errors: { property: {}, object: { forenameSurname: ['Forename cannot match surname.'] } } }
```

## Additional properties

By default, if additional properties are present on the object instance which have not been defined on the schema, then an error will be added to `errors.property` for each additional property, with a default message:

```javascript
validate({})({ foo: 'bar' })
//=> { isValid: false, errors: { property: { foo: ['Unexpected property'] }, object: {} } }
```

If you wish to ignore additional properties on the object instance, then you can configure the `validate` function with the `additionalProps.ignore` option (see below).

## Invalid objects

If the object instance is an invalid object, then the validation result will fail with a default property and message on `errors.object`:

```javascript
validate(schema)('foo')
//=> { isValid: false, errors: { property: {}, object: { validObject: 'Invalid object.' } }}
```

This default property and message can be configured with the `invalidObject` options (see below).

## Configuring validate

You can created a customised version of the `validate` function by using `configure`:

```javascript
import configure from 'inspected/configure'

const options = { ... }
const validate = configure(options)
```

The available options are:

| Option                  | Default                | Description                                                                                                                                                               |
| ----------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| additionalProps.ignore  | false                  | Flag whether to ignore properties on the object instance which are not defined on the schema.                                                                             |
| additionalProps.message | 'Unexpected property.' | The message to add to the `errors.property` object when an additional property is found on the object instance. Only applicable when `additionalProps.ignore` is `false`. |
| invalidObject.property  | 'validObject'          | The property to add to `errors.object` if the object instance is an invalid object.                                                                                       |
| invalidObject.message   | 'Invalid object.'      | The property message to add to `errors.object` if the object instance is an invalid object.                                                                               |
| logger                  | message => {}          | Output validation processing to a logger. The `message` is an object containing `type`, `stage`, `message`, and `data` properties.                                        |

## Error formatters

You can format the `errors` object within the validation result by using the supplied error formatters, which is useful for displaying the error messages:

```javascript
import errorPerProperty from 'inspected/formatters/error-per-property'
import errorPerMessage from 'inspected/formatters/error-per-message'

const schema = {
  name: [
    [isString, 'Name must be a string.'],
    [val => val && val.length > 3, 'Name must be longer than 3 characters.'],
  ],
}

const result = validate(schema)({ name: false })

errorPerProperty(result.errors)
//=> { property: [ { name: 'name', messages: ['Name must be a string.', 'Name must be longer than 3 characters.'] } ], object: [] }

errorPerMessage(result.errors)
//=> { property: [ { name: 'name', message: 'Name must be a string.' }, { name: 'name', message: 'Name must be longer than 3 characters.' } ], object: [] }
```

## Schema functions

| Function   | Format                   |
| ---------- | ------------------------ |
| isArray    | val => bool              |
| isBoolean  | val => bool              |
| isEmpty    | val => bool              |
| isFunction | val => bool              |
| isNil      | val => bool              |
| isObject   | val => bool              |
| isOptional | val => predicate => bool |
| isRequired | val => predicate => bool |
| isString   | val => bool              |

## Recipies

### Object of shape

```javascript
import isRequired from 'inspected/schema/is-required'
import isString from 'inspected/schema/is-string'
import validate from 'inspected/validate'

const userSchema = {
  name: [[isRequired(isString), 'Name is required.']],
}

validate(userSchema)({ name: 'user' }) 
// => { isValid: true, ... }
```
