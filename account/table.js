const db = require("../models");
const { Op } = require("sequelize");

class AccountTable {
  static storeAccount({ usernameHash, emailHash, passwordHash }) {
    return db.users
      .create({
        usernameHash: usernameHash,
        passwordHash: passwordHash,
        emailHash: emailHash,
      })
      .then((res) => {
        return res;
      })
      .catch((e) => {
        throw e;
      });
  }

  static getAccount({ usernameHash, emailHash }) {
    if (usernameHash && emailHash) {
      return db.users
        .findAll({
          where: {
            [Op.or]: [{ usernameHash: usernameHash }, { emailHash: emailHash }],
          },
        })
        .then((res) => {
          let thing = res;
          return thing;
        })
        .catch((e) => {
          throw e;
        });
    } else {
      console.log("here here here");
      return db.users
        .findAll({
          where: {
            usernameHash: usernameHash,
          },
        })
        .then((res) => {
          let userFound = JSON.stringify(res[0]);
          let account = JSON.parse(userFound);
          return account;
        })
        .catch((e) => {
          console.log("e is happening", e);
          throw e;
        });
    }
  }

  static updateSessionId({ sessionId, usernameHash }) {
    return db.users
      .update(
        {
          session_id: sessionId,
        },
        {
          where: {
            usernameHash: usernameHash,
          },
        }
      )
      .then((res) => {
        return res;
      })
      .catch((e) => {
        throw e;
      });
  }
}

module.exports = AccountTable;
