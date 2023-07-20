const models = require("../models");
const { checkPassword } = require("../services/auth");
const { createJwt } = require("../services/jwt");

const signup = async (req, res) => {
  try {
    await models.auth.insert(req.body);
    res.status(201).json({ msg: "Compte créé, Merci de vous identifier." });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      res.status(409).json({ msg: "Email déjà existant." });
    } else {
      res.sendStatus(500);
    }
  }
};

const signin = async (req, res) => {
  const user = await models.auth.findUser(req.body.email);

  if (
    user[0][0] &&
    (await checkPassword(user[0][0].password, req.body.password))
  ) {
    const token = createJwt({ email: req.body.email });
    res
      .status(200)
      .cookie("mira_tkn_lg", token, {
        httpOnly: true,
        expire: new Date() + 1000 * 60 * 60,
      })
      .json({
        msg: `Connexion réussit, Bienvenue ${user[0][0].firstname}`,
        id: user[0][0].id,
        picture: user[0][0].picture,
        firstname: user[0][0].firstname,
        lastname: user[0][0].lastname,
        role: user[0][0].role,
      });
  } else {
    res.sendStatus(401);
  }
};

module.exports = {
  signup,
  signin,
};
