import React, {useEffect, useRef, useState} from 'react';
import {ScrollView} from 'react-native';
import {View, Button, Text} from 'react-native-ui-lib';
import {NavigationFunctionComponent} from 'react-native-navigation';
import {observer} from 'mobx-react';
import Video from 'react-native-video';

import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import {encode} from '../lib/encoder';
import {FFmpegKitConfig} from 'ffmpeg-kit-react-native';
import {styles} from './styles';
import {createManifest} from '../lib/encoder/createManifest';
import {usesMetricSystem} from 'react-native-localize';

export const Example: NavigationFunctionComponent<ExampleScreenProps> = observer(
  ({componentId, value}) => {
    const options: ImageLibraryOptions = {
      mediaType: 'video',
      selectionLimit: 20,
    };

    const videoRef = useRef(null);

    const [inputFile, setInputFile] = useState<string | undefined>('');
    const [fileName, setFileName] = useState<string>('');
    const [videoFile, setVideoFile] = useState<string | undefined>();
    console.log(videoFile);
    const selectVideo = (video: ImagePickerResponse) => {
      console.log(video);
      if (video.assets && video.assets.length > 0) {
        setInputFile(video.assets[0].uri);
        setFileName(video.assets[0].fileName?.split('.')[0]);
      } else {
        console.warn('Unable to select Video');
      }
    };
    useEffect(() => {
      FFmpegKitConfig.init();
    }, []);

    const [videoPaths, setVideoPaths] = useState([]);
    const [audioPath, setAudioPath] = useState('');
    const [dirPath, setDirPath] = useState('');
    const startEncoding = async () => {
      console.log('Encoding started ...');
      let {videoPaths, audioPath, dirPath} = await encode({inputFile, fileName});
      setVideoPaths(videoPaths);
      setAudioPath(audioPath);
      setDirPath(dirPath);
      // setVideoFile(output);
    };

    return (
      <View flex bg-bgColor>
        <ScrollView contentInsetAdjustmentBehavior="always">
          <Button
            marginV-s1
            label={'Select Video'}
            onPress={() => launchImageLibrary(options, r => selectVideo(r))}
          />
          <Button marginV-s1 label={'Encode me'} onPress={startEncoding} />
          <Button
            marginV-s1
            label={'Execute me next'}
            onPress={() => createManifest(videoPaths, audioPath, dirPath, fileName)}
          />
          {videoFile && (
            <Video
              source={{uri: videoFile}}
              ref={videoRef}
              hideShutterView={true}
              // paused={this.state.paused}
              // onError={this.onPlayError}
              resizeMode={'stretch'}
              style={styles.videoPlayerViewStyle}
            />
          )}
        </ScrollView>
      </View>
    );
  },
);
