const { default: mongoose } = require("mongoose");
const Course = require("../models/course.model");
const Enrollment = require("../models/enrollment.model");
const Chapter = require("../models/chapter.model");
// const { getChaptersByCourseIdService } = require("./chapter.service");

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
  const query = search
    ? { title: { $regex: search, $options: "i" }, isActive: true }
    : {};
  const skip = (page - 1) * limit;
  const courses = await Course.find(query)
    .skip(skip)
    .limit(+limit)
    .select("_id title category description price thumbnailUrl")
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

  const courseData = await Course.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(id) },
    },
    {
      $lookup: {
        from: "chapters",
        localField: "_id",
        foreignField: "course",
        as: "chapters",
      },
    },
    {
      $unwind: {
        path: "$chapters",
        preserveNullAndEmptyArrays: true, // Giữ giá trị null nếu không có chapter
      },
    },
    {
      $lookup: {
        from: "lessons",
        localField: "chapters._id",
        foreignField: "chapter",
        as: "chapters.lessons",
      },
    },
    {
      $group: {
        _id: "$_id",
        title: { $first: "$title" },
        description: { $first: "$description" },
        price: { $first: "$price" },
        thumbnailUrl: { $first: "$thumbnailUrl" },
        author: { $first: "$author" },
        category: { $first: "$category" },
        isActive: { $first: "$isActive" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        chapters: { $push: "$chapters" },
      },
    },
    {
      $set: {
        chapters: {
          $filter: {
            input: "$chapters",
            as: "chapter",
            cond: { $ne: ["$$chapter", {}] }, // Loại bỏ object rỗng
          },
        },
      },
    },
  ]);
  return courseData;
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
    isActive: true,
  })
    .skip(skip)
    .limit(limit)
    .select("_id title category description price thumbnailUrl")
    .lean();

  return {
    data: courses,
    totalPage: Math.ceil(courses.length / limit),
    currentPage: page,
  };
};

const deleteACourseByIdService = async (id) => {
  if (!id || !new mongoose.Types.ObjectId(id))
    throw new Error("Invalid category id");
  const course = await Course.findOne({
    _id: new mongoose.Types.ObjectId(id),
    isActive: true,
  });
  if (!course) throw new Error("Course not found");
  await Course.updateOne(
    { _id: new mongoose.Types.ObjectId(id) },
    { isActive: false }
  );
  return "Delete successfully";
};

const getCoursesByUserIdService = async (id) => {
  const enrollments = await Enrollment.find({
    user: new mongoose.Types.ObjectId(id),
    status: "COMPLETED",
  })
    .lean()
    .select("course");
  console.log(enrollments);
  let ids = [];
  for (let errollment of enrollments) {
    ids.push(errollment.course);
  }
  const courses = await Course.find({ _id: { $in: ids } }).lean();
  return courses;
};

module.exports = {
  createCourseService,
  getCoursesService,
  getCourseByIdService,
  getCourseByCategoryIdService,
  deleteACourseByIdService,
  getCoursesByUserIdService,
};
