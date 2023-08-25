import { View, ActivityIndicator, Text, TouchableOpacity, ScrollView, Image, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { useTheme } from '../../hooks';
import { Colors } from '../../theme/Variables';
import { changeTheme, ThemeState } from '../../store/theme';
import { setImage, setMetadata, EfixState } from '../../store/efix';
import { CameraOptions, launchCamera } from 'react-native-image-picker';
import { getExif, setExif } from '../../utils/exif';

const Example = () => {
  const [picture, setPicture] = React.useState<string | null>(null);
  const state = useSelector((_state: { efix: EfixState }) => _state.efix);
  const { t } = useTranslation(['example', 'welcome']);
  const { Common, Fonts, Gutters, Layout, Images, darkMode: isDark } = useTheme();
  const dispatch = useDispatch();

  const onChangeTheme = ({ theme, darkMode }: Partial<ThemeState>) => {
    dispatch(changeTheme({ theme, darkMode }));
  };

  const onChangeLanguage = (lang: 'fr' | 'en') => {
    i18next.changeLanguage(lang);
  };

  useEffect(() => {
    console.log('useEffect');
  }, []);

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
      setExif(response?.assets[0], {
        latitude: 41.0428465,
        longitude: 29.0075283,
      })
        .then(res => {
          setPicture(res.jpeg_base64);
          getExif(res.base64)
            .then(exif => {
              console.log('exif', exif);
            })
            .catch(err => {
              console.log('getExif err', err);
            });
        })
        .catch(err => {
          console.log('setExif err', err);
        });
    }
  };

  return (
    <ScrollView style={Layout.fill} contentContainerStyle={[Layout.fullSize, Layout.fill, Layout.colCenter, Layout.scrollSpaceBetween]}>
      <View style={[Layout.fill, Layout.relative, Layout.fullWidth, Layout.justifyContentCenter, Layout.alignItemsCenter]}>
        <Image source={{ uri: state.image?.uri }} resizeMode="center" style={[Layout.absolute, styles.image]} />

        <Image style={[Layout.absolute, styles.star]} source={Images.sparkles.topRight} resizeMode={'contain'} />
      </View>
      <View style={[Layout.fill, Layout.justifyContentBetween, Layout.alignItemsStart, Layout.fullWidth, Gutters.regularHPadding]}>
        <View>
          <Text style={[Fonts.titleRegular]}>{t('welcome:title')}</Text>
          <Text style={[Fonts.textBold, Fonts.textRegular, Gutters.regularBMargin]}>{t('welcome:subtitle')}</Text>
          <Text style={[Fonts.textSmall, Fonts.textLight]}>{t('welcome:description')}</Text>
        </View>

        <View style={[Layout.row, Layout.justifyContentBetween, Layout.fullWidth, Gutters.smallTMargin]}>
          <TouchableOpacity style={[Common.button.circle, Gutters.regularBMargin]} onPress={takePicture}>
            <Image
              source={Images.icons.send}
              style={{
                tintColor: isDark ? '#A6A4F0' : Colors.circleButtonColor,
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={[Common.button.circle, Gutters.regularBMargin]} onPress={() => onChangeTheme({ darkMode: !isDark })}>
            <Image
              source={Images.icons.colors}
              style={{
                tintColor: isDark ? '#A6A4F0' : Colors.circleButtonColor,
              }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={[Common.button.circle, Gutters.regularBMargin]} onPress={() => onChangeLanguage(i18next.language === 'fr' ? 'en' : 'fr')}>
            <Image
              source={Images.icons.translate}
              style={{
                tintColor: isDark ? '#A6A4F0' : Colors.circleButtonColor,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Example;

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
