import mongoose, {Schema} from "mongoose";

const replyCommentSchema = new Schema({
   
    content: {
        type: String,
        required: true
    },
    comment: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
}, {timestamps: true})



export const replyComment = mongoose.model("Playlist", playlistSchema)