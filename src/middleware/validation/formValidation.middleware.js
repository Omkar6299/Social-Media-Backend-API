import { body, validationResult } from "express-validator";

export default class FormValidation {
    static async newUser(req, res, next) {
        const rules = [
            body('name').trim().notEmpty().withMessage('Name should not be empty.').isLength({ min: 3 }).withMessage('Name at least 3 characters.'),
            body('email')
                .notEmpty().withMessage('Email must not be empty.')
                .isEmail().withMessage('Enter a valid email.'),
            body('password').notEmpty().withMessage('Password must be required.').isLength({ min: 8 }).withMessage('At least 8 characters'),
            body('gender').toLowerCase().isIn(["male","female","other"]).withMessage(`'${req.body.gender}' is not a valid  gender. Choose from male, female and other only.`),
        ];

        await Promise.all(rules.map((rule) => rule.run(req)));
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } else {
            next();
        }
    }

    static async updateUser(req, res, next) {
        const rules = [
            body('name').trim().notEmpty().withMessage('Name should not be empty.').isLength({ min: 3 }).withMessage('Name at least 3 characters.'),
            body('email')
                .notEmpty().withMessage('Email must not be empty.')
                .isEmail().withMessage('Enter a valid email.'),
            body('gender').toLowerCase().isIn(["male","female","other"]).withMessage(`'${req.body.gender}' is not a valid  gender. Choose from male, female and other only.`),
        ];

        await Promise.all(rules.map((rule) => rule.run(req)));
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } else {
            next();
        }
    }

    static async userLogin(req, res, next) {
        const rules = [
            body('email').isEmail().withMessage('Enter a valid email.'),
            body('password').notEmpty().withMessage('Enter a password.')
        ];

        await Promise.all(rules.map((rule) => rule.run(req)));
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } else {
            next();
        }
    }

    static async resetPassword(req, res, next) {
        const rules = [
            body('email').isEmail().withMessage('Enter a valid email.'),
            body('newPassword').notEmpty().withMessage('Enter a new password.'),
            body('cPassword')
            .exists({checkFalsy: true}).withMessage('Confirmation password is also required')
            .custom((value, {req}) => value === req.body.newPassword).withMessage("The passwords do not match")
        ];

        await Promise.all(rules.map((rule) => rule.run(req)));
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } else {
            next();
        }
    }

    static async email(req, res, next) {
        const rules = [
            body('email').isEmail().withMessage('Enter a valid email.'),
        ];

        await Promise.all(rules.map((rule) => rule.run(req)));
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } else {
            next();
        }
    }

    static async imageUpload(req, res, next) {
        const rules = [
            body('avatar').custom((value, { req }) => {
                if (!req.file) {
                    throw new Error('Please upload a image');
                }
                const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
                const fileExtension = req.file.originalname.toLowerCase().slice(-4);
                if (!allowedExtensions.includes(fileExtension)) {
                    throw new Error('Invalid file extension. Allowed extensions: jpg, jpeg, png, gif');
                }
                return true;
            })
        ];

        await Promise.all(rules.map((rule) => rule.run(req)));
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } else {
            next();
        }
    }

    static async postData(req, res, next) {
        const rules = [
            body('caption').trim().notEmpty().withMessage('Caption is required.').isLength({ max: 50 }).withMessage('Caption is maximum 50 chars long.'),
            body('imageUrl').custom((value, { req }) => {
                if (!req.file) {
                    throw new Error('Please upload a media');
                }
                const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
                const fileExtension = req.file.originalname.toLowerCase().slice(-4);
                if (!allowedExtensions.includes(fileExtension)) {
                    throw new Error('Invalid file extension. Allowed extensions: jpg, jpeg, png, gif');
                }
                return true;
            })
        ];

        await Promise.all(rules.map((rule) => rule.run(req)));
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        } else {
            next();
        }
    }
}
