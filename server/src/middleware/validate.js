/**
 * Validates and replaces req.body / req.query / req.params with the parsed (coerced, stripped) values.
 * Usage: validate({ body: schema, query: schema, params: schema })
 */
export const validate = (schemas) => (req, _res, next) => {
  try {
    for (const key of ["params", "query", "body"]) {
      if (schemas[key]) req[key] = schemas[key].parse(req[key] ?? {});
    }
    next();
  } catch (err) {
    next(err); // ZodError → formatted by errorHandler
  }
};
