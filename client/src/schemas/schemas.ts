import * as Yup from "yup";

export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .trim(),
  password: Yup.string()
    .min(3, "Password must be at least 3 characters long")
    .required("Password is required")
    .trim(),
});


export const TutorSignupSchema = Yup.object().shape({
  name: Yup.string()
    .required("Full Name is required")
    .matches(/^[A-Za-z\s]+$/, "Name should only contain alphabets")
    .trim(),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .trim(),
  password: Yup.string()
    .min(3, "Password must be at least 3 characters")
    .required("Password is required")
    .trim(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm Password is required")
    .trim(),
  bio: Yup.string()
    .max(500, "Bio cannot exceed 500 characters")
    .required("Bio is required")
    .trim(),
  certificates: Yup.mixed()
    .nullable()
    .test("fileSize", "File too large", (value) => {
      if (value && value instanceof FileList) {
        return Array.from(value).every((file) => file.size <= 5 * 1024 * 1024);
      }
      return true;
    })
    .test("fileType", "Unsupported file format", (value) => {
      if (value && value instanceof FileList) {
        return Array.from(value).every((file) =>
          ["application/pdf", "image/png", "image/jpeg", "image/webp"].includes(
            file.type
          )
        );
      }
      return true;
    })
    .required("Certificates are required"),
});


export const CreateCourseSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Course title should be of minimum 3 charecters")
    .required("Course title is required")
    .trim(),
  description: Yup.string()
    .min(3, "Course description should be of minimum 3 charecters")
    .required("Course description is required")
    .trim(),
  category: Yup.string()
    .notOneOf(["select"], "Please select a category")
    .required("Category is required"),
  price: Yup.number()
    .required("Course price is required")
    .positive("Price must be positive"),
  thumbnail: Yup.mixed()
    .required("Thumbnail is required")
    .test("fileSize", "File size is too large", (value) => {
      const file = value as File;
      return file ? file.size <= 5 * 1024 * 1024 : true;
    })
    .test("fileType", "Invalid file type", (value) => {
      const file = value as File;
      return file
        ? ["image/png", "image/jpeg", "image/webp"].includes(file.type)
        : true;
    }),
});

export const lectureSchema = Yup.object().shape({
  title: Yup.string().required("Title is required").trim(),
  description: Yup.string().required("Description is required").trim(),
  duration: Yup.number()
    .required("Duration is required")
    .positive("Duration must be a positive number"),
  order: Yup.number()
    .required("Order is required")
    .positive("Order must be a positive number"),
  videoFile: Yup.mixed()
    .required("Video file is required")
    .test("fileType", "Invalid video format", (value) => {
      const file = value as File;
      return file
        ? ["video/mp4", "video/webm", "video/avi"].includes(file.type)
        : true;
    })
    .test("fileSize", "Video file is too large", (value) => {
      const file = value as File;
      return file ? file.size <= 100 * 1024 * 1024 : true;
    }),
});

export const formSchema = Yup.object().shape({
  lectures: Yup.array().of(lectureSchema),
});



export const editLectureSchema = Yup.object().shape({
  title: Yup.string().required("Title is required").trim(),
  description: Yup.string().required("Description is required").trim(),
  duration: Yup.number()
    .required("Duration is required")
    .positive("Duration must be a positive number"),
  order: Yup.number()
    .required("Order is required")
    .positive("Order must be a positive number"),
  videoFile: Yup.mixed().nullable().test(
    "video-required",
    "Either a video file or a video URL is required",
    function (value) {
      const { videoUrl } = this.parent;
      return !!videoUrl || !!value;
    }
  ),
});

export const editFormSchema = Yup.object().shape({
  lectures: Yup.array().of(editLectureSchema),
});



export const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .required("Full Name is required")
    .matches(/^[A-Za-z\s]+$/, "Name should only contain alphabets")
    .trim(),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .trim(),
  password: Yup.string()
    .min(3, "Password should be of minimum 3 charecters for user")
    .required("Password is required")
    .trim(),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm password is required")
    .trim(),
});

export 
const EditCourseSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Course title should be of minimum 3 characters")
    .required("Course title is required")
    .trim(),
  description: Yup.string()
    .min(3, "Course description should be of minimum 3 characters")
    .required("Course description is required")
    .trim(),
  category: Yup.string()
    .notOneOf(["select"], "Please select a category")
    .required("Category is required")
    .trim(),
  price: Yup.number()
    .required("Course price is required")
    .positive("Price must be positive"),
  thumbnail: Yup.mixed()
    .nullable()
    .test("fileValidation", "Invalid file", function (value) {
      if (!value || typeof value === "string") {
        return true;
      }
      const file = value as File;
      const validTypes = ["image/png", "image/jpeg", "image/webp"];
      const isValidSize = file.size <= 5 * 1024 * 1024;
      const isValidType = validTypes.includes(file.type);

      if (!isValidSize) {
        return this.createError({ message: "File size is too large" });
      }
      if (!isValidType) {
        return this.createError({ message: "Invalid file type" });
      }

      return true;
    }),
});