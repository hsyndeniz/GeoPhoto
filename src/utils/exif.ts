import { Asset } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import piexif from 'piexifjs';

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
 * Store the image in a temporary directory to facilitate metadata manipulation
 * while retaining the integrity of the original image.
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

    const temp_path = `${RNFS.TemporaryDirectoryPath}${image.fileName}.jpg`;
    const jpeg_base64 = `data:image/jpeg;base64,${image.base64}`;

    await RNFS.copyFile(image.uri as string, temp_path);

    const gps: any = {};

    gps[piexif.GPSIFD.GPSLatitudeRef] = coordinates.latitude < 0 ? 'S' : 'N';
    gps[piexif.GPSIFD.GPSLatitude] = piexif.GPSHelper.degToDmsRational(
      coordinates.latitude,
    );
    gps[piexif.GPSIFD.GPSLongitudeRef] = coordinates.longitude < 0 ? 'W' : 'E';
    gps[piexif.GPSIFD.GPSLongitude] = piexif.GPSHelper.degToDmsRational(
      coordinates.longitude,
    );

    const exif = piexif.dump({ GPS: gps });
    const data = piexif.insert(exif, jpeg_base64);

    const raw_base64 = data.split('data:image/jpeg;base64,')[1];
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
