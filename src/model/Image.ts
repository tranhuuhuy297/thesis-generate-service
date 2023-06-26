import { Schema, model, Document } from "mongoose";

interface IImage {
  prompt_id: string;
  user_id: string;
  image_src: string;
  progress: string;
  create_time: Date;
  update_time: Date;
}

interface IImageModel extends IImage, Document {}

const ImageSchema: Schema = new Schema(
  {
    prompt_id: { type: String, required: true },
    user_id: { type: String, required: true },
    image_src: { type: String, required: true },
    progress: { type: String, required: false },
    create_time: { type: Date, require: true },
    update_time: { type: Date, require: true },
  },
  { collection: "Image", versionKey: false }
);

const Image = model<IImageModel>("Image", ImageSchema);

export { Image };
