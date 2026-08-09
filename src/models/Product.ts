import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  category: string;
  subcategory: string;
  gender?: string;
  images: string[];
  sizes: string[];
  inventory?: Record<string, number>;
  highlights: Record<string, string>;
  sizeChart: Record<string, string>;
  features: { title: string; desc: string }[];
  careInstructions: string[];
  modelInfo: string;
  stock: number;
  featured: boolean;
  isActive: boolean;
  reviews: IReview[];
  averageRating: number;
  numReviews: number;
  enquiries?: number;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema: Schema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a product description'],
    },
    originalPrice: {
      type: Number,
      required: [true, 'Please provide original MRP'],
    },
    salePrice: {
      type: Number,
      required: [true, 'Please provide sale price'],
    },
    discount: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
    },
    subcategory: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      default: 'Unisex',
    },
    images: {
      type: [String],
      required: true,
    },
    sizes: {
      type: [String],
      default: [],
    },
    inventory: {
      S: { type: Number, default: 0 },
      M: { type: Number, default: 0 },
      L: { type: Number, default: 0 },
      XL: { type: Number, default: 0 },
      XXL: { type: Number, default: 0 },
    },
    highlights: {
      type: Map,
      of: String,
      default: {},
    },
    sizeChart: {
      type: Map,
      of: String,
      default: {},
    },
    features: [
      {
        title: { type: String },
        desc: { type: String },
      },
    ],
    careInstructions: {
      type: [String],
      default: [
        'Machine wash cold with like colors',
        'Do not bleach',
        'Tumble dry low',
        'Iron on low heat if needed',
        'Do not dry clean',
      ],
    },
    modelInfo: {
      type: String,
      default: '',
    },
    stock: {
      type: Number,
      required: [true, 'Please provide available stock'],
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    reviews: [ReviewSchema],
    averageRating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    enquiries: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Auto-calculate discount before saving
ProductSchema.pre('save', function () {
  if (this.originalPrice && this.salePrice) {
    this.discount = Math.round(((this.originalPrice as number) - (this.salePrice as number)) / (this.originalPrice as number) * 100);
  }
});

if (mongoose.models.Product) {
  delete mongoose.models.Product;
}
export default mongoose.model<IProduct>('Product', ProductSchema);
