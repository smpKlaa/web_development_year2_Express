## Endpoint Authorization

All authorization is done in the routers. This removes repeated code from the models. \
Example from [userRouter.js](src/api/routes/userRouter.js):

```javascript
userRouter
  .route('/:id')
  .get(getUserById)
  .put(authenticateToken, authorizeUser, putUser)
  .delete(authenticateToken, authorizeUser, deleteUser);
```

---

### /api/v1/users - [userRouter.js](src/api/routes/userRouter.js)

The *users* endpoint authorization is handled by [authorizeUser.js](src/middlewares/authorizeUser.js). First the request token is authorized. After that a simple middleware named *authorizeUser* runs. First the request users role is checked. If role is Admin, the authorization is automatically passed:
```javascript
if (res.locals.user.role === 'admin') {
    console.log('Admin authorized');
    next();
    return;
  }
```
If the users role is *not* 'admin', the users ```user_id``` is checked. If it matches the endpoints that the request is trying to reach the request is authorized:
```javascript
if (req.params.id == res.locals.user.user_id) {
  console.log('Request authorized');
  next();
  return;
} else {
  console.log('Unauthorized request');
  res.sendStatus(403);
  return;
}
```

---

### /api/v1/cats - [catRouter.js](src/api/routes/catRouter.js)

The *cats* endpoint authorization is handled by the [authorizeCatOwner.js](src/middlewares/authorizeCatOwner.js), and is almost identical to */api/v1/users*. The main difference being that instead of comparing the endpoints *id* parameter. The users id is compared to the cats *owner* attribute:

```javascript
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
```

Additionally the HTTP requests *method* attribute is checked. Since when creating a new cat item, there is no ```cat.cat_id``` to compare against. So the code checks for ```POST``` method type. If this is true, the new cat objects *owner* attribute is compared to the users id:
```javascript
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
```
