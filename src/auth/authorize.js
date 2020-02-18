const isAuthenticated = require("./rules").isAuthenticated

export const AuthResolver = {
  authenticated(next, src, args, context) {
    if (isAuthenticated(args, context)) {
      return next();
    }

    throw new Error(
      `You are not authorized. Please contact application admin for authorization.`
    );
  }
};