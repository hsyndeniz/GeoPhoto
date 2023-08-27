declare module 'piexifjs' {
  export interface GPSHelper {
    degToDmsRational: (degFloat: number) => [[number, number], [number, number], [number, number]];
    dmsRationalToDeg: (dmsArray: [[number, number], [number, number], [number, number]], ref: 'N' | 'S' | 'E' | 'W') => number;
  }

  interface ExifDict {
    [key: string]: any;
  }

  interface GPSIFD {
    GPSVersionID: number;
    GPSLatitudeRef: number;
    GPSLatitude: number;
    GPSLongitudeRef: number;
    GPSLongitude: number;
    GPSAltitudeRef: number;
    GPSAltitude: number;
    GPSTimeStamp: number;
    GPSSatellites: number;
    GPSStatus: number;
    GPSMeasureMode: number;
    GPSDOP: number;
    GPSSpeedRef: number;
    GPSSpeed: number;
    GPSTrackRef: number;
    GPSTrack: number;
    GPSImgDirectionRef: number;
    GPSImgDirection: number;
    GPSMapDatum: number;
    GPSDestLatitudeRef: number;
    GPSDestLatitude: number;
    GPSDestLongitudeRef: number;
    GPSDestLongitude: number;
    GPSDestBearingRef: number;
    GPSDestBearing: number;
    GPSDestDistanceRef: number;
    GPSDestDistance: number;
    GPSProcessingMethod: number;
    GPSAreaInformation: number;
    GPSDateStamp: number;
    GPSDifferential: number;
    GPSHPositioningError: number;
  }

  interface ExifLoader {
    load: (data: string) => ExifDict;
    dump: (exif: any) => string;
    insert: (exif: any, jpeg: string) => string;
    GPSIFD: GPSIFD;
    GPSHelper: GPSHelper;
  }

  const exifLoader: ExifLoader;

  export default exifLoader;
}
