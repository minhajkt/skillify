import { NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { Request, Response } from "express";

export const validateUserCreation = [
  body("name")
    .isLength({ min: 3 })
    .withMessage("Name should be of minimum 3 charecters for user")
    // .isAlpha().withMessage('Name should not contain numbers')
    .trim(),

  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 3 })
    .withMessage("Password should contain atleast 3 charecters")
    .matches(/[0-9]/)
    .withMessage("Password should contain atleast one number")
    // .matches(/[a-zAZ]/).withMessage('Password must contain a letter')
    .trim(),

  body("confirmPassword")
    .isLength({ min: 3 })
    .withMessage("Password should contain atleast 3 charecters")
    .matches(/[0-9]/)
    .withMessage("Password should contain atleast one number")
    // .matches(/[a-zAZ]/).withMessage('Password must contain a letter')
    .trim(),


];

export const validateTutorCreation = [
  body("name")
    .isLength({ min: 3 })
    .withMessage("Name should be of minimum 3 charecters for tutor")
    // .isAlpha().withMessage('Name should not contain numbers')
    .trim(),

  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 3 })
    .withMessage("Password should contain atleast 3 charecters")
    .matches(/[0-9]/)
    .withMessage("Password should contain atleast one number")
    // .matches(/[a-zAZ]/).withMessage('Password must contain a letter')
    .trim(),

  body("confirmPassword")
    .isLength({ min: 3 })
    .withMessage("Password should contain atleast 3 charecters")
    .matches(/[0-9]/)
    .withMessage("Password should contain atleast one number")
    // .matches(/[a-zAZ]/).withMessage('Password must contain a letter')
    .trim(),

  body("bio")
  .isLength({ min: 3 })
  .withMessage("Please provide a short description")
  // .matches(/[a-zAZ]/).withMessage('Password must contain a letter')
  .trim(),
];


export const validateUserLogin = [
  body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 3 })
    .withMessage("Password should contain atleast 3 charecters")
    .matches(/[0-9]/)
    .withMessage("Password should contain atleast one number")
    // .matches(/[a-zAZ]/).withMessage('Password must contain a letter')
    .trim(),

   body("bio") 
    .isLength({ min: 3 })
    .withMessage("Please provide a short description")
    // .matches(/[a-zAZ]/).withMessage('Password must contain a letter')
    .trim(),    
];

export const validateUserUpdation = [
  body("name")
    .isLength({ min: 3 })
    .withMessage("Name should be of minimum 3 charecters for updattion")
    // .isAlpha().withMessage('Name should not contain numbers')
    .trim(),

];

export const validateForgotPassword = [
  body("newPassword")
    .isLength({ min: 3 })
    .withMessage("Password should contain atleast 3 charecters")
    .matches(/[0-9]/)
    .withMessage("Password should contain atleast one number")
    // .matches(/[a-zAZ]/).withMessage('Password must contain a letter')
    .trim(),
  body("confirmNewPassword")
    .isLength({ min: 3 })
    .withMessage("Password should contain atleast 3 charecters")
    .matches(/[0-9]/)
    .withMessage("Password should contain atleast one number")
    // .matches(/[a-zAZ]/).withMessage('Password must contain a letter')
    .trim(),
];



export const validateCourseCreation = [
  body("title")
    .isLength({ min: 3 })
    .withMessage("Title should contain atleast 3 charecters"),

  body("description")
    .isLength({ min: 3 })
    .withMessage("Desciption should contain atleast 3 charecters")
    .trim(),

  body("category")
    .isLength({ min: 3 })
    .withMessage("Select a category")
    .trim(),

    body("price")
      .isFloat({ gt: 0 }) 
    .withMessage("Enter a valid price")
    .trim(),
];

export const validateCourseUpdate = [
  body("title")
    .optional()
    .isString()
    .isLength({ min: 3 })
    .withMessage("Title should contain at least 3 characters"),
  body("description")
    .optional()
    .isString()
    .isLength({ min: 3 })
    .withMessage("Description should contain at least 3 characters"),
  body("category")
    .optional()
    .isIn(["Software", "Business", "Accounts"])
    .withMessage("Select a valid category"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Enter a valid price"),
];

export const handleValidationErrors = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
         res.status(400).json({errors: errors.array()})         
    return;
        }
    next()  
}