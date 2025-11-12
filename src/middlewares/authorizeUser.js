// import {findUserById} from '../api/models/userModel.js';

const authorizeUser = async (req, res, next) => {
  console.log('authorizeUser', res.locals.user);

  // Automatically authorize admin users.
  // Querying database may be more secure.
  //   const user = await findUserById(res.locals.user.user_id);
  if (res.locals.user.role === 'admin') {
    console.log('Admin authorized');
    next();
    return;
  }

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
