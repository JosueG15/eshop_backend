import Category, { ICategory } from "../models/categoryModel";

export class CategoryService {
  public async getAllCategories(): Promise<ICategory[]> {
    return await Category.find().exec();
  }

  public async getCategoryById(id: string): Promise<ICategory | null> {
    return await Category.findById(id).exec();
  }

  public async createCategory(
    categoryData: Partial<ICategory>
  ): Promise<ICategory> {
    const category = new Category(categoryData);
    return await category.save();
  }

  public async updateCategory(
    id: string,
    categoryData: Partial<ICategory>
  ): Promise<ICategory | null> {
    return await Category.findByIdAndUpdate(id, categoryData, {
      new: true,
    }).exec();
  }

  public async deleteCategory(id: string): Promise<ICategory | null> {
    return Category.findByIdAndRemove(id).exec();
  }
}
