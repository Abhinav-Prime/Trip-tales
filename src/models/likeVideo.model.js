import mongoose,{Schema} from "mongoose";

const likesVideoSchema= new Schema({
    video:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    },
    likedBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
 
},{timestamps:true});

export const LikeVideo = mongoose.model("LikeVideo",likesVideoSchema);