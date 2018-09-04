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
    lowercase: true,
    // uppercase: true,
    trim: true,
  }, 
  author: String,
  tags: {
    type: [ String ],
    validate: {
      isAsync: true,
      validator: function(v, callback) { 
        // Do some async work..
        setTimeout(() => {
          const result = v && v.length > 0;   
          callback(result);
        }, 2000);
      },
      message: 'A course should have at least one tag.'
    }
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: { 
    type: Number, 
    min: 10,
    max: 200,
    get: v => Math.round(v),
    set: v => Math.round(v),
    required: function () { return this.isPublished } 
  }
});
const Course = mongoose.model('Course', courseSchema);

async function createCourse() {
  const course = new Course({
    name: 'Angular Course',
    author: 'Diego',
    category: 'Web',
    tags:  [ 'frontend' ],
    isPublished: true,
    price: 15.8
  });
  try {
    const result = await course.save();
    console.log(result);
  } catch(ex) {
    for (field in ex.errors)
      console.log(ex.errors[field].message);
  }
}

async function getCourses() {
  const courses = await Course
    .find({ _id: '5b8eb8258d003e6481f156fb' })
    .limit(10)
    .sort({name: 1 })
    // .select({ name: 1, tags: 1 });
  console.log(courses[0].price);
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

// createCourse();
getCourses();