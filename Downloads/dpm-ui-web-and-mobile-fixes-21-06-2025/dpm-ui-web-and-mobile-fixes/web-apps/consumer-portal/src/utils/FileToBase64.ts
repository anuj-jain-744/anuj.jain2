import { toast } from "react-toastify";
import { TOAST_AUTOCLOSE_TIMER } from "@dpm/shared-module";

export const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            if (!file.type.startsWith('image/')) {
                resolve(result.split(",")[1]);
                return;
            }

            const compressingToast = toast.info("Compressing image, please wait...", { autoClose: TOAST_AUTOCLOSE_TIMER || false });
            const img = new Image();
            img.src = result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const MAX_WIDTH = 800;
                const scaleSize = MAX_WIDTH / img.width;
                canvas.width = MAX_WIDTH;
                canvas.height = img.height * scaleSize;
                ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                const compressedDataUrl = canvas.toDataURL(file.type, 0.7);
                const compressedBase64 = compressedDataUrl.split(",")[1];
                toast.dismiss(compressingToast);
                resolve(compressedBase64);
            };

            img.onerror = (error) => {
                toast.dismiss(compressingToast);
                reject(error);
            };
        };
        reader.onerror = (error) => reject(error);
    });

};