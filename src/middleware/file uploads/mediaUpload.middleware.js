import multer from "multer";
import path from "path";

const storageConfigMedia = multer.diskStorage({
    destination: (req, file, callback) => {
        const filePath = path.resolve('medial uploads', 'post media');
        callback(null, filePath);
    },
    filename: (req, file, callback) => {
        file_name(req, file, callback);
    }
});

const storageConfigAvatar = multer.diskStorage({
    destination: (req, file, callback) => {
        const filePath = path.resolve('medial uploads', 'user profile');
        callback(null, filePath);
    },
    filename: (req, file, callback) => {
        file_name(req, file, callback);
    }
});

async function file_name(req, file, callback) {
    const currentDate = new Date();

    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so we add 1
    const year = currentDate.getFullYear();
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    const uniqueId = Date.now(); // Generate a unique identifier to ensure file name uniqueness
    const fileName = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}_${uniqueId}_${file.originalname}`;
    callback(null, fileName);
}

export const mediaUpload = multer({ storage: storageConfigMedia });
export const avatarUpload = multer({ storage: storageConfigAvatar });

