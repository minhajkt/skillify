import { NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { Request, Response } from "express";

export const validateUserCreation = [
    body('name')
        .isLength({min:3}).withMessage('Name should be of minimum 3 charecters')
        // .isAlpha().withMessage('Name should not contain numbers')
        .trim(),

    body('email')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail(),
        
    body('password') 
        .isLength({min:3}).withMessage('Password should contain atleast 3 charecters')
        .matches(/[0-9]/).withMessage('Password should contain atleast one number')
        // .matches(/[a-zAZ]/).withMessage('Password must contain a letter')
        .trim()  
]

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
];

export const validateUserUpdation = [
  body("name")
    .isLength({ min: 3 })
    .withMessage("Name should be of minimum 3 charecters")
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

export const handleValidationErrors = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
         res.status(400).json({errors: errors.array()})
    return;
        }
    next()  
}