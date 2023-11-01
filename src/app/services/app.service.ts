import { BadRequestException, Injectable } from "@nestjs/common";
import { CloudinaryService } from "src/cloudinary/services/cloudinary.service";

@Injectable()
export class AppService {
    constructor(private cloudinary: CloudinaryService) {}

    async uploadImageToCloudinary(file: Express.Multer.File) {
        const imageUploaded = await this.cloudinary
            .uploadImage(file)
            .catch((err) => {
                throw new BadRequestException("Invalid file type.");
            });

        return {
            id: imageUploaded.signature,
            _id: imageUploaded.signature,
            url: imageUploaded.url,
            alt: imageUploaded.alt,
            format: imageUploaded.format,
        };
    }
}
