import {findCatById} from '../api/models/catModel.js';
// import {findUserById} from '../api/models/userModel.js';

const authorizeCatOwner = async (req, res, next) => {
  console.log('authorizeCatOwner', res.locals.user);

  // Automatically authorize admin users.
  // Querying database may be more secure.
  // const user = await findUserById(res.locals.user.user_id);
  if (res.locals.user.role === 'admin') {
    console.log('Admin authorized');
    next();
    return;
  }

  if (req.method === 'POST') {
    if (req.body.owner == res.locals.user.user_id) {
      console.log('Request authorized');
      next();
      return;
    } else {
      console.log('Unauthorized request');
      res.sendStatus(403);
      return;
    }
  }
  const cat = await findCatById(req.params.id, true);

  if (!cat) {
    res.sendStatus(404);
    return;
  }

  if (cat.owner === res.locals.user.user_id) {
    console.log('Request authorized');
    next();
    return;
  } else {
    console.log('Unauthorized request');
    res.sendStatus(403);
    return;
  }
};

export {authorizeCatOwner};
