const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mongo-exercises', { useNewUrlParser: true })
  .then(console.log('Connected to the DB...'))
  .catch(new Error('Error connecting to the DB...'));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [ String ],
  date: { type: Date, default: Date.now },
  isPublished: Boolean
});

const Course = mongoose.model('Course', courseSchema);

async function getCourses() {
    return await Course
      .find({ isPublished: true, tags: { $in: ['frontend', 'backend'] } })
      .sort('-price')
      .select('name author price');
}

async function run() {
  const courses = await getCourses();
  console.log(courses);
}
run();