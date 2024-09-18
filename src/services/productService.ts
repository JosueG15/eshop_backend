import { GlobalFilters } from "../models/globalModels";
import Product, { IProduct } from "../models/productModel";

export class ProductService {
  public async getAllProducts(
    filters: GlobalFilters,
    page: number,
    limit: number
  ): Promise<IProduct[]> {
    const skip = (page - 1) * limit;

    const products = await Product.find(filters)
      .populate("category")
      .skip(skip)
      .limit(limit)
      .exec();

    return products;
  }

  public async getProductById(id: string): Promise<IProduct | null> {
    return await Product.findById(id).populate("category").exec();
  }

  public async createProduct(
    productData: Partial<IProduct>
  ): Promise<IProduct> {
    const product = new Product(productData);
    return await product.save();
  }

  public async updateProduct(
    id: string,
    productData: Partial<IProduct>
  ): Promise<IProduct | null> {
    return await Product.findByIdAndUpdate(id, productData, {
      new: true,
    }).exec();
  }

  public async deleteProduct(id: string): Promise<IProduct | null> {
    return await Product.findByIdAndRemove(id).exec();
  }

  public async getProductCount(filters: GlobalFilters): Promise<number> {
    return await Product.countDocuments(filters).exec();
  }

  public async getFeaturedProducts(
    page: number,
    limit: number
  ): Promise<IProduct[]> {
    const skip = (page - 1) * limit;
    return await Product.find({ isFeatured: true })
      .skip(skip)
      .limit(limit)
      .exec();
  }
}
