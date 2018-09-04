const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connecto to MongoDB...', err));

const courseSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    minlength: 5,
    maxlength: 255,
    // match: /pattern/
   },
  category: { 
    type: String,
    required: true,
    enum: ['web', 'mobile', 'network'],
  }, 
  author: String,
  tags: {
    type: [ String ],
    validate: {
      validator: function(v) { return v && v.length > 0; },
      message: 'A course should have at least one tag.'
    }
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: { 
    type: Number, 
    min: 10,
    max: 200,
    required: function () { return this.isPublished } 
  }
});
const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
  const course = new Course({
    name: 'Angular Course',
    author: 'Diego',
    category: 'web',
    tags: null,
    isPublished: true,
    price: 15
  });
  try {
    const result = await course.save();
    console.log(result);
  } catch(ex) {
    console.log(ex.message);
  }
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
async function removeCourse(id) {
  // const result = await Course.deleteOne({ _id: id });
  const result = await Course.findByIdAndRemove(id);
  console.log(result);
}

createCourse();