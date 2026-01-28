module.exports = {
  name: 'example',
  policy: (actionParams) => {
    return async (req, res, next) => {
      try {
        // split the string into token
        if (["/api/auth/login", "/api/auth/register"].includes(req.url)) {
          return next()
        }
        console.log(req.url)
        console.log(req.headers)
        if (req.headers["x-service-key"]) {
          return next()
        }
        if (!req.headers["x-service-key"]) {
          // This is not an internal call
          if (!req.headers.authorization) {
            res.status(401).json(
              {
                message: "Missing authorization header in gateway",
                data: null,
                code: 401,
                success: false
              }
            );
            return next();
          }
          try {
            // Temporaily hack (we should use gateway eventually)
            const response = await fetch('http://localhost:8001/api/auth/verify-jwt-token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': req.headers.authorization },
            });

            const data = await response.json();
            if (response.ok) {
              console.debug(data)
              // Inject decrypted data into headers for the backend to see
              req.headers['X-User-Context'] = JSON.stringify(data.data);
              return next();
            } else {
              res.status(response.status).json(data);
            }
          } catch (err) {
            console.log(err)
            res.status(500).send('Auth Service Unavailable');
          }
        }
      } catch (err) {
        console.log(err)
        next(err)
      }
    }
  }
};