"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reactions extends Model {
    static associate({ User, Article }) {
      this.belongsTo(User, { foreignKey: "userId" });
      this.belongsTo(Article, { foreignKey: "articleId" });
    }

    toJSON() {
      return { ...this.get(), id: undefined };
    }
  }
  Reactions.init(
    {
      emoji: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Reactions",
    }
  );
  return Reactions;
};
