import mongoose,{Schema} from "mongoose";

const likesBlogSchema= new Schema({
    video:{
        type:Schema.Types.ObjectId,//one to who being subscribed
        ref:"Video"
    },
    likedBy:{
        type:Schema.Types.ObjectId,//one to who being subscribed
        ref:"User"
    },
 
},{timestamps:true});

export const LikeBlog = mongoose.model("LikeBlog",likesBlogSchema);