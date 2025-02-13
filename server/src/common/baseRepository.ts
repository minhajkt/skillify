import mongoose, { Document } from "mongoose";

export interface IBaseRepository<T extends Document> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findByEmail(email: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<T | null>;
}

export class BaseRepository<T extends Document> {
  private model: mongoose.Model<T>;

  constructor(model: mongoose.Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    const entity = new this.model(data);
    console.log("this has worked from base for creation");

    return await entity.save();
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async findByEmail(email: string): Promise<T | null> {
    return await this.model.findOne({ email });
  }

  async findAll(): Promise<T[]> {
    return await this.model.find();
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    console.log('update p from base repo')
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id);
  }
}
