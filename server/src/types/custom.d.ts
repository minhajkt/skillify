import { Request } from "express";

interface AuthRequest extends Request {
  user?: {
    id: string;
    _id: string
  };
}

// declare global {
//   namespace Express {
//     interface User {
//       id: string;
//     }
//     interface Request {
//       user?: User;
//     }
//   }
// }


// interface RequestWithUser extends Request {
//   user?: {
//     _id: string;
//     id: string;
//   };
// }

// declare global {
//   namespace Express {
//     interface Request {
//       user?: User; 
//     }
//   }
// }