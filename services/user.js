const User = require('../models/user');
const EntityNotFoundError = require('../errors/entityNotFound');

/**
 * A user
 * @typedef {Object} User
 * @param {string} id The id of the user
 * @param {string} name The name of the user
 * @param {string} email The email of the user
 * @param {string} alias The alias of the user
 */

/**
* A new user
* @typedef {Object} NewUser
* @param {string} name The name of the user
* @param {string} email The email of the user
* @param {string} alias The alias of the user
*/

/**
 * A user database model
 * @typedef {Object} UserModel
 * @param {string} _id The id of the user
 * @param {string} name The name of the user
 * @param {string} email The email of the user
 * @param {string} alias The alias of the user
 */

/**
* Creates a new user
* @param {NewUser} user The user to be saved
* @returns {string} The id of the new created user
*/
function create(user) {
  const newUser = new User({
    name: user.name,
    email: user.email,
    alias: user.alias,
  });

  return newUser
    .save()
    .then(({ _id }) => _id);
}

/**
 * Check if a user with an id exists
 * @param {string} id The id to check
 * @returns {boolean} If the user exists
 */
function exists(id) {
  return User
    .findById(id)
    .then(foundUser => !!foundUser);
}

/**
* Get a user by id
* @param {string} id The id of the user
* @returns {Promise<User>} The user with the id
*/
function get(id) {
  return User
    .findById(id)
    .then((user) => {
      if (!user) {
        throw new EntityNotFoundError('user', id);
      }

      return transform(user);
    });
}

/**
 * Get all the users
 * @returns {Promise<User[]>} The existing users
 */
function getAll() {
  return User
    .find()
    .then(users => users.map(user => transform(user)));
}

/**
 * Rename recursively the properties _id to id
 * @param {UserModel} userModel The object with _id property
 * @returns {User} The object with id property
 */
function transform(userModel) {
  const {
    _id: id,
    name,
    email,
    alias,
  } = userModel;

  const userCopy = {
    id,
    name,
    email,
    alias,
  };

  return userCopy;
}

module.exports = {
  create,
  exists,
  get,
  getAll,
};
