const { createContainer } = require("instances-container");

// external
const { nanoid } = require("nanoid");
const bcrypt = require("bcrypt");
const pool = require("./database/postgres/pool");

// internal
const UserRepositoryPostgres = require("./repository/UserRepositoryPostgres");
const BcryptPasswordHash = require("./security/BcryptPasswordHash");

//use case
const AddUserUseCase = require("../Applications/use_case/AddUserUseCase");
const UserRepository = require("../Domains/users/UserRepository");
const PasswordHash = require("../Applications/security/PasswordHash");

const container = createContainer();

container.register([
  {
    key: UserRepository.name,
    Class: UserRepositoryPostgres,
    parameter: {
      dependencies: [
        {
          concrete: pool,
        },
        {
          concrete: nanoid,
        },
      ],
    },
  },
  {
    key: PasswordHash.name,
    Class: BcryptPasswordHash,
    parameter: {
      dependencies: [
        {
          concrete: bcrypt,
        },
      ],
    },
  },
]);

container.register([
  {
    key: AddUserUseCase.name,
    Class: AddUserUseCase,
    parameter: {
      injectType: "destructuring",
      dependencies: [
        {
          name: "userRepository",
          internal: UserRepository.name,
        },
        {
          name: "passwordHash",
          internal: PasswordHash.name,
        },
      ],
    },
  },
]);

module.exports = container;
