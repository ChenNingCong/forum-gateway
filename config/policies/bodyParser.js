const bodyParser = require('body-parser');

module.exports = {
  name: 'body-parser',
  policy: (actionParams) => {
    return (req, res, next) => {
      bodyParser.json()(req, res, (err) => {
        if (err) {
          return next(err);
        }

        bodyParser.urlencoded({ extended: true })(req, res, next);
      });
    };
  }
};