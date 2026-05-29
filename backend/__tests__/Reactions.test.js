import { describe, it, expect } from "vitest";
import { Sequelize, DataTypes } from "sequelize";
const initReactions = require("../models/Reactions");

describe("Reactions Model", () => {
  const sequelize = new Sequelize("sqlite::memory:");
  const Reactions = initReactions(sequelize, DataTypes);

  it("defines emoji field as non-nullable string type", () => {
    expect(Reactions.rawAttributes).toHaveProperty("emoji");
    expect(Reactions.rawAttributes.emoji.type.key).toBe("STRING");
    expect(Reactions.rawAttributes.emoji.allowNull).toBe(false);
  });

  it("has static associate method that sets up User and Article relations", () => {
    expect(typeof Reactions.associate).toBe("function");
    const mockUserModel = {};
    const mockArticleModel = {};
    expect(() => Reactions.associate({ User: mockUserModel, Article: mockArticleModel })).not.toThrow();
  });

  it("overrides toJSON to exclude id field from serialized output", () => {
    const testReaction = Reactions.build({ id: 123, emoji: "🔥", userId: 1, articleId: 456 });
    const result = testReaction.toJSON();
    expect(result).not.toHaveProperty("id");
    expect(result.emoji).toBe("🔥");
  });
});