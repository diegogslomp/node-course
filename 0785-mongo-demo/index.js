const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connecto to MongoDB...', err));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [ String ],
  date: { type: Date, default: Date.now },
  isPublished: Boolean
});
const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
  const course = new Course({
    name: 'Angular Course',
    author: 'Diego',
    tags: ['angular', 'frontend'],
    isPublished: true,
    price: Number
  });
  const result = await course.save();
  console.log(result);
}

async function getCourses() {
  const courses = await Course
    .find({ author: 'Diego', isPublished: true })
    .limit(10)
    .sort({name: 1 })
    .select({ name: 1, tags: 1 });
  console.log(courses);
}

async function updateCourse(id) {
  // Find first approach
  // const course = await Course.findById(id);
  // if (!course) return;

  // course.isPublished = true;
  // course.author='Another author'

  // const result = await course.save();
  // console.log(result);

  // Update first approach
  // const result = await Course.update({ _id: id }, { 
  //   $set: {
  //     author: 'Diego',
  //     isPublished: false
  //   }
  // });
  // console.log(result);

  // Similar but shows updated course
  const course = await Course.findByIdAndUpdate(id, {
    $set: {
      author: 'Diego G',
      isPublished: false
    }
  }, { new: true });
  console.log(course); 
}
updateCourse('5b8d9de58c0a4c11b8077047');