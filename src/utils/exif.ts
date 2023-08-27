import { Asset } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import piexif from 'piexifjs';

/**
 * Extracts Exif metadata from a base64-encoded image.
 * @param {string} base64 - The base64-encoded image data.
 * @returns {Object} - Extracted Exif metadata.
 */
export const getExif = async (base64: string): Promise<any> => {
  try {
    const jpeg_base64 = `data:image/jpeg;base64,${base64}`;
    const exif = piexif.load(jpeg_base64);

    return exif;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

/**
 * Modifies Exif metadata to include GPS coordinates and stores the modified image.
 * @param {Asset} image - The image object.
 * @param {Object} coordinates - The GPS coordinates {latitude, longitude}.
 * @returns {Object} - Base64-encoded image data with modified Exif metadata.
 */
export const setExif = async (
  image: Asset,
  coordinates: { latitude: number; longitude: number },
): Promise<{
  base64: string;
  jpeg_base64: string;
}> => {
  try {
    if (!image.uri || !image.base64) {
      throw new Error('Invalid image');
    }

    // Create a temporary file path for the image copy
    const temp_path = `${RNFS.TemporaryDirectoryPath}${image.fileName}.jpg`;

    // Prepare the base64-encoded image data
    const jpeg_base64 = `data:image/jpeg;base64,${image.base64}`;

    // Copy the original image to the temporary path
    await RNFS.copyFile(image.uri as string, temp_path);

    // Prepare GPS metadata
    const gps: any = {};
    gps[piexif.GPSIFD.GPSLatitudeRef] = coordinates.latitude < 0 ? 'S' : 'N';
    gps[piexif.GPSIFD.GPSLatitude] = piexif.GPSHelper.degToDmsRational(coordinates.latitude);
    gps[piexif.GPSIFD.GPSLongitudeRef] = coordinates.longitude < 0 ? 'W' : 'E';
    gps[piexif.GPSIFD.GPSLongitude] = piexif.GPSHelper.degToDmsRational(coordinates.longitude);

    // Dump GPS metadata
    const exif = piexif.dump({ GPS: gps });

    // Insert modified metadata into the image data
    const data = piexif.insert(exif, jpeg_base64);
    const raw_base64 = data.split('data:image/jpeg;base64,')[1];

    // Write modified image data to the temporary file
    await RNFS.writeFile(temp_path, raw_base64, 'base64');

    return {
      base64: raw_base64,
      jpeg_base64: data,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
