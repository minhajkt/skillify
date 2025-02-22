import { MutableRefObject } from "react";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  profilePhoto: string
  student?:{
    _id: string
    name: string
  }
  courseId?: {
    title: string
  }
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
  draftVersion? : {
    title?: string
    category?:string
    price?:number
  }
}

export interface ICourseForDisplay {
  _id?:string 
  courseId: {
    _id: string;
    thumbnail: string;
    title: string;
    category: string;
    createdBy: {
      name: string
    }
    isApproved: string
  };
  createdAt: string
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
  isApproved: string;
  bio: string;
  certificates: string[];
  courseId?: {
    title: string;
    createdBy: {
      _id: string;
      name: string;
    };
  };
  createdAt:string
};

export interface IStudent  {
  _id: string;
  name: string;
  email: string;
  status: string; 
  isActive: boolean;
  createdAt:string
};

export interface MyStudent {
  student: IUser;
}

export interface MyTutor {
  tutor: ITutor;
  courseId: {
    createdBy: {
      _id: string
    }
  }
}


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
  videoUrl?:string
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

export interface IProgress {
  completedLecturesDetails?: string[]
  certificateId?: string
  completed?: boolean
}

export interface VideoCallProps {
  isVideoCallActive: boolean;
  localVideoRef: MutableRefObject<HTMLVideoElement | null>;
  remoteVideoRef: MutableRefObject<HTMLVideoElement | null>;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  onStartCall: () => void;
  onEndCall: () => void;
  onAcceptCall: () => void;
  onRejectCall: () => void;
  incomingCall: boolean;
}

export interface NotificationProps {
  open: boolean;
  message: string;
  onClose: () => void;
  onClick: () => void;
}

export interface IMessage {
  _id: string;
  senderId: string;
  recipientId: string;
  message: string;
  read: boolean;
  readAt?: string | null;
  timestamp?: string;
  fileUrl?: string | null;
  fileType?: string | null;
}

export interface PaymentPending {
  _id: string,
  tutorId: {
    name: string;
  };
  courseId: {
    title: string;
    price: number
  };
  newEnrollments: number;
  amount: number;
  updatedAt: string
}