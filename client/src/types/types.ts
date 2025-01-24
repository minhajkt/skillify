export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  profilePhoto: string
}

export interface ICourse {
  
  _id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  tutor: string;
  category: string;
  isApproved: string;
  name?: string;
  price: number;
  lectures?: ILectures[];
  thumbnail: File | null
  rating?: number
}

export interface ICourseForDisplay {
  courseId: {
    _id: string;
    thumbnail: string;
    title: string;
    category: string;
    createdBy: {
      name: string
    }
  };
}

export interface ILectures  {
  _id: string;
  title: string;
  description: string;
  videoUrl?: string;
  order: number;
  duration: number

};

export interface ITutor {
  _id: string;
  name: string;
  email: string;
  status: string;
  isActive: boolean;
  isApproved: string
  bio: string
  certificates: string[];
};

export interface IStudent  {
  _id: string;
  name: string;
  email: string;
  status: string; 
  isActive: boolean;
};


export interface IReport {
  _id: string;
  courseId: {_id: string;  title: string } | null;
  userId: { name: string } | null;
  lectureId: { title: string } | null;
  reportDescription: string;
};

export interface ITutorSignupValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  bio: string;
  certificates: FileList | null;
}

export interface ICreateCourse {
  title: string;
  description: string;
  category: string;
  price: string;
  thumbnail: File | null;
}

export interface Lecture {
  title: string;
  description: string;
  duration: string;
  order: string;
  videoFile: File | null;
}

export interface FormValues {
  lectures: Lecture[];
}


export interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ICategory {
  name: string
  icon: string
}

export interface IReview {
  _id: string;
  userId: IUser;
  rating: number;
  reviewText: string
  createdAt: string
}

export interface ReportLectureModalProps {
  open: boolean;
  onClose: () => void;
  courseId: string;
  lectureId: string;
}

export interface ReviewComponentProps {
  courseId: string;
  setAverageRating: (rating: number) => void;
  setTotalReviews: (reviews: number) => void;
}


export interface IEditCourse {
  title: string;
  description: string;
  category: string;
  price: string;
  thumbnail: File | string | null;
}
