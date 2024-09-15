import mongoose,{Schema} from "mongoose";

const commentAlbumSchema= new Schema({
   
    content:{
        type:String,
        required:true,
    },
    album:{
        type:Schema.Types.ObjectId,
        ref:"Album"
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },

},{timestamps:true});

export const CommentAlbum = mongoose.model("CommentAlbum",commentAlbumSchema);