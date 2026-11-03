/**
 * Request Validation Runner Middleware
 * Executes validator schemas against req.body, req.query, or req.params.
 */
const { unprocessable } = require('../utils/apiResponse');

const validate = (validatorFn) => {
  return (req, res, next) => {
    const { isValid, errors } = validatorFn(req);
    if (!isValid) {
      return unprocessable(res, 'Validation error', errors);
    }
    next();
  };
};

module.exports = validate;

