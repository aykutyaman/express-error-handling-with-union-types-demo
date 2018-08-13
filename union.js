/**
 * Create an object with a type for each name in the `types` array.
 * Each type is a factory that can receive some data, and returns an object
 * with a function method `match`.
 * The method `match` will receive an object with a function for each available
 * type, and then execute the function for the specific type that the object
 * belongs to.
 */
const union = types =>
  types.reduce((prev, type) => ({
    ...prev,
    [type]: data => ({
      match: fns => {
        return fns[type](data);
      },
    }),
  }), {});

module.exports = union;
