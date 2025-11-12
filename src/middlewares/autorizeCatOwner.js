import {findCatById} from '../api/models/catModel.js';

const authorizeCatOwner = async (req, res, next) => {
  console.log('authorizeCatOwner', res.locals.user);

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
