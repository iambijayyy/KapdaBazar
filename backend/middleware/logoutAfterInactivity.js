import jwt from 'jsonwebtoken';

// In a new file named `logoutAfterInactivity.js`

const maxIdleTimeInMilliseconds = 100 * 60 * 1000; // 2 minutes

const logoutAfterInactivity = (req, res, next) => {
  let timer;

  const resetTimer = () => {
    clearTimeout(timer);
    timer = setTimeout(logoutUser, maxIdleTimeInMilliseconds);
  };

  const logoutUser = () => {
    // Clear the token from the request headers
    req.headers.authorization = '';

    // Continue to the next middleware or route
    next();
  };

  // Reset the timer on every user activity (e.g., request to the server)
  req.on('data', resetTimer);
  req.on('end', resetTimer);

  next();
};

export default logoutAfterInactivity;
