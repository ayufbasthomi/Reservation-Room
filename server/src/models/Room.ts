import mongoose, { Schema, Document } from "mongoose";

export interface IRoom extends Document {
  name: string;
  status: string;
  capacity?: number;
  image?: string;
}

const RoomSchema: Schema = new Schema({
  name: { type: String, required: true },
  status: { type: String, default: "available" },
  capacity: { type: Number },
  image: { type: String }
});

export default mongoose.model<IRoom>("Room", RoomSchema);
