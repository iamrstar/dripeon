import mongoose, { Schema, Document } from 'mongoose';

export interface ILink {
  label: string;
  url: string;
}

export interface IColumn {
  title: string;
  links: ILink[];
}

export interface IImageCard {
  title: string;
  imageUrl: string;
  url: string;
}

export interface ICategory extends Document {
  name: string;
  slug: string;
  columns: IColumn[];
  imageCards: IImageCard[];
}

const LinkSchema = new Schema({
  label: { type: String, required: true },
  url: { type: String, required: true },
});

const ColumnSchema = new Schema({
  title: { type: String, required: true },
  links: [LinkSchema],
});

const ImageCardSchema = new Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  url: { type: String, required: true },
});

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    columns: {
      type: [ColumnSchema],
      default: [],
    },
    imageCards: {
      type: [ImageCardSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
