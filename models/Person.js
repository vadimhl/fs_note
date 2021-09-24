const mongoose = require('mongoose')

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
mongoose.connect(process.env.MONGO_PB, options).catch( error => console.log("-- connect -- :",error));

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema);