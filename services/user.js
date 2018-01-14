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
 * A user database model
 * @typedef {Object} UserModel
 * @param {string} _id The id of the user
 * @param {string} name The name of the user
 * @param {string} email The email of the user
 * @param {string} alias The alias of the user
 */

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
  get,
  getAll,
};
