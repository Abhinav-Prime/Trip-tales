import mongoose,{Schema} from "mongoose";

const commentBlogSchema= new Schema({
   
    content:{
        type:String,
        required:true,
    },
    blog:{
        type:Schema.Types.ObjectId,
        ref:"Blog"
    },
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },

},{timestamps:true});

export const CommentBlog = mongoose.model("CommentBlog",commentBlogSchema);