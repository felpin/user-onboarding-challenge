const DEFAULT_MESSAGE = 'The entity was not found';

class EntityNotFoundError extends Error {
  constructor(entity, id, message = DEFAULT_MESSAGE) {
    super();
    this.name = EntityNotFoundError.name;
    this.message = message;
    this.entity = entity;
    this.id = id;
  }
}

module.exports = EntityNotFoundError;
