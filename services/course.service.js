const { default: mongoose } = require("mongoose");
const Course = require("../models/course.model");

const createCourseService = async ({
  title,
  description,
  price,
  thumbnailUrl,
  author,
  category,
}) => {
  const course = await Course.findOne({ title, author }).lean();
  if (course) throw new Error(`${title} of ${author} is already existed`);
  return await Course.create({
    title,
    description,
    price,
    thumbnailUrl,
    category,
  });
};

const getCoursesService = async ({ search = "", page = 1, limit = 10 }) => {
  const query = search ? { title: { $regex: search, $options: "i" } } : {};
  const skip = (page - 1) * limit;
  const courses = await Course.find(query)
    .skip(skip)
    .limit(+limit)
    .select("_id title category description price")
    .lean();
  return {
    data: courses,
    totalPage: Math.ceil(courses.length / limit),
    currentPage: page,
  };
};

const getCourseByIdService = async (id) => {
  if (!id || !new mongoose.Types.ObjectId(id))
    throw new Error("Invalid objectId");
  const course = await Course.findOne({ _id: id })
    .select("_id title category description price")
    .lean();
  if (!course) throw new Error("Course not found");
  return course;
};

const getCourseByCategoryIdService = async ({
  categoryId,
  page = 1,
  limit = 10,
}) => {
  if (!categoryId || !new mongoose.Types.ObjectId(categoryId))
    throw new Error("Invalid categoryId");

  const skip = (page - 1) * limit;
  const courses = await Course.find({
    category: new mongoose.Types.ObjectId(categoryId),
  })
    .skip(skip)
    .limit(limit)
    .select("_id title category description price")
    .lean();

  return {
    data: courses,
    totalPage: Math.ceil(courses.length / limit),
    currentPage: page,
  };
};

module.exports = {
  createCourseService,
  getCoursesService,
  getCourseByIdService,
  getCourseByCategoryIdService,
};
