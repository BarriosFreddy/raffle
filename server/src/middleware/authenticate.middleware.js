import jsonwebtoken from 'jsonwebtoken';

export const isAuthenticated = (req, res, next) => {
  const { SECRET_KEY } = process.env;
  try {
    const { authorization } = req?.headers;
    if (!authorization) {
      res.status(403).send('authorization token is not valid');
      return;
    }
    const jwt = authorization.split(/\s/).pop()
    if (!SECRET_KEY) throw new Error('Secret key has not been set');
    const decodedData = jsonwebtoken.verify(jwt, SECRET_KEY);
    if (typeof decodedData !== 'string') {
      const { data } = decodedData;
      res.locals.infoUser = data;
    }
    next();
  } catch (e) {
    console.error(e);
    res.status(403).send('something went wrong');
  }
};
