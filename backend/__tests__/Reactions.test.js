import { describe, it, expect, vi } from "vitest";
const { Model, DataTypes } = require("sequelize");
const defineReactionsModel = require("../models/Reactions");

describe("Reactions Model", () => {
  const mockSequelize = { Model };
  const Reactions = defineReactionsModel(mockSequelize, DataTypes);

  it("should define non-nullable emoji field of type STRING", () => {
    expect(Reactions.rawAttributes).toHaveProperty("emoji");
    expect(Reactions.rawAttributes.emoji.type.key).toBe("STRING");
    expect(Reactions.rawAttributes.emoji.allowNull).toBe(false);
  });

  it("associate method should correctly set up User and Article belongsTo relationships", () => {
    expect(typeof Reactions.associate).toBe("function");
    const mockUserModel = {};
    const mockArticleModel = {};
    Reactions.belongsTo = vi.fn();
    
    Reactions.associate({ User: mockUserModel, Article: mockArticleModel });
    
    expect(Reactions.belongsTo).toHaveBeenCalledTimes(2);
    expect(Reactions.belongsTo).toHaveBeenNthCalledWith(1, mockUserModel, { foreignKey: "userId" });
    expect(Reactions.belongsTo).toHaveBeenNthCalledWith(2, mockArticleModel, { foreignKey: "articleId" });
  });

  it("toJSON method should strip id property from serialized output", () => {
    const testInstance = Reactions.build({ id: 99, emoji: "🎉", userId: 3, articleId: 17 });
    const result = testInstance.toJSON();
    
    expect(result).not.toHaveProperty("id");
    expect(result.emoji).toBe("🎉");
    expect(result.userId).toBe(3);
    expect(result.articleId).toBe(17);
  });
});