import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Share } from 'react-native';
import Geolocation, { GeolocationResponse } from '@react-native-community/geolocation';
import { CameraOptions, launchCamera } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Toast from 'react-native-toast-message';
import RNFS from 'react-native-fs';
import { useTheme } from '../../hooks';
import { setExif } from '../../utils/exif';
import { changeTheme, ThemeState } from '../../store/theme';
import { setImage, EfixState } from '../../store/efix';

export const Camera = () => {
  // Redux store connections and state hooks
  const state = useSelector((_state: { efix: EfixState }) => _state.efix);
  const [location, setLocation] = useState<any>();
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation(['example', 'welcome']);
  const { Common, Fonts, Gutters, Layout, Images, Colors, darkMode: isDark } = useTheme();
  const dispatch = useDispatch();

  // Function to change the theme
  const onChangeTheme = ({ theme, darkMode }: Partial<ThemeState>) => {
    dispatch(changeTheme({ theme, darkMode }));
  };

  // Function to take a picture using the device's camera
  const takePicture = async () => {
    const options: CameraOptions = {
      mediaType: 'photo',
      quality: 1,
      saveToPhotos: false,
      includeBase64: true,
      includeExtra: true,
    };
    const response = await launchCamera(options);

    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorMessage || response.errorCode) {
      console.log('ImagePicker Error: ', response.errorMessage);
    } else {
      if (!response.assets) {
        return;
      }
      dispatch(setImage({ image: response?.assets?.[0] }));
    }
  };

  // Function to get the device's current location
  const getLocation = (): Promise<GeolocationResponse> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        info => resolve(info),
        error => {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'You need to enable location services to modify the metadata',
            position: 'bottom',
          });
          reject(error);
        },
      );
    });
  };

  // Function to update the metadata of the image using GPS coordinates
  const updateMetadata = async () => {
    try {
      if (!state.image) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'You need to take a picture first',
          position: 'bottom',
        });
        return;
      }

      if (!location) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'You need to enable location services to modify the metadata',
          position: 'bottom',
        });
        return;
      }
      setLoading(true);
      await setExif(state.image, location);
      setLoading(false);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Metadata updated',
        position: 'bottom',
      });
    } catch (error) {
      console.log('updateMetadata error', error);
      setLoading(false);
    }
  };

  // Function to share the original image
  const shareOriginal = async () => {
    Share.share({
      title: 'Share',
      message: 'Check out this picture',
      url: state.image?.uri,
    });
  };

  // Function to share the modified image
  const shareModified = async () => {
    const temp_path = `${RNFS.TemporaryDirectoryPath}${state?.image?.fileName}.jpg`;
    Share.share({
      title: 'Share',
      message: 'Check out this picture',
      url: temp_path,
    });
  };

  // Fetch the device's location when the component mounts
  useEffect(() => {
    getLocation()
      .then(info => setLocation({ latitude: info.coords.latitude, longitude: info.coords.longitude }))
      .catch(err => {
        console.log('getLocation err', err);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'You need to enable location services to modify the metadata',
          position: 'bottom',
        });
      });
  }, []);

  return (
    <ScrollView
      testID="camera-wrapper"
      style={Layout.fill}
      contentContainerStyle={[Layout.fullSize, Layout.fill, Layout.colCenter, Layout.scrollSpaceBetween]}
    >
      <View style={[Layout.fill, Layout.relative, Layout.fullWidth, Layout.justifyContentCenter, Layout.alignItemsCenter]}>
        <Image source={{ uri: state.image?.uri }} resizeMode="cover" style={[Layout.absolute, styles.image]} />
        <Image style={[Layout.absolute, styles.star]} source={Images.sparkles.topRight} resizeMode={'contain'} />
      </View>
      <Text style={[Fonts.textPrimary, Gutters.tinyMargin]}>{t('welcome:dataToModify')}</Text>
      {!location ? (
        <Text style={[Fonts.textError, Gutters.tinyMargin]}>{t('welcome:locationMessage')}</Text>
      ) : (
        <Text style={[Fonts.textSuccess, Gutters.tinyPadding]}>{JSON.stringify(location, null, 2)}</Text>
      )}
      <View style={[Layout.fill, Layout.justifyContentBetween, Layout.alignItemsStart, Layout.fullWidth, Gutters.regularHPadding]}>
        <View style={[Layout.col, Layout.justifyContentBetween, Layout.fullWidth, Gutters.smallTMargin]}>
          <TouchableOpacity style={[Common.button.outlineRounded, Gutters.tinyMargin]} onPress={takePicture}>
            <Text style={Fonts.textSmall}>{t('welcome:takePicture')}</Text>
          </TouchableOpacity>

          {state.image && (
            <TouchableOpacity disabled={loading} style={[Common.button.outlineRounded, Gutters.tinyMargin]} onPress={updateMetadata}>
              <Text style={Fonts.textSmall}>{loading ? <ActivityIndicator size="small" color={Colors.primary} /> : t('welcome:updateMetadata')}</Text>
            </TouchableOpacity>
          )}

          {state.image && (
            <TouchableOpacity disabled={loading} style={[Common.button.outlineRounded, Gutters.tinyMargin]} onPress={shareOriginal}>
              <Text style={Fonts.textSmall}>{'Share original'}</Text>
            </TouchableOpacity>
          )}

          {state.image && (
            <TouchableOpacity disabled={loading} style={[Common.button.outlineRounded, Gutters.tinyMargin]} onPress={shareModified}>
              <Text style={Fonts.textSmall}>{'Share modified'}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={[Common.button.outlineRounded, Gutters.tinyMargin]} onPress={() => onChangeTheme({ darkMode: !isDark })}>
            <Text style={Fonts.textSmall}>{t('welcome:changeTheme')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Camera;

const styles = StyleSheet.create({
  image: {
    height: 240,
    width: 240,
    borderRadius: 20,
  },
  star: {
    top: '5%',
    right: 16,
  },
});
