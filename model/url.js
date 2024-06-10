import mongoose from 'mongoose'
import { type } from 'os';

const UrlSchema = new mongoose.Schema({
    longUrl: String,
    shortUrl: String,
    clicks: {type: Number, default: 0},
    date: {type: Date, default: Date.now}

  });

UrlSchema.virtual('formattedDate').get(function() {
    return this.date.toLocaleDateString('en-US',{
      weekday: "short",
      month : `short`,
      day : '2-digit',
      year : 'numeric'
    })
});
const Urls = mongoose.model('Urls', UrlSchema);  

export default Urls