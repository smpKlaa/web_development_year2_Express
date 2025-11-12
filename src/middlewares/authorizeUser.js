const authorizeUser = async (req, res, next) => {
  console.log('authorizeUser', res.locals.user);

  if (req.params.id == res.locals.user.user_id) {
    console.log('Request authorized');
    next();
    return;
  } else {
    console.log('Unauthorized request');
    res.sendStatus(403);
    return;
  }
};

export {authorizeUser};
