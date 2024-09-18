import Category from "../models/categoryModel";

export const checkCategoryExists = async (categoryId: string) => {
  const categoryExists = await Category.findById(categoryId);
  if (!categoryExists) {
    throw new Error(`Category with ID ${categoryId} does not exist`);
  }
};
