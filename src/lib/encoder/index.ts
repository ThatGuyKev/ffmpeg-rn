import {useState} from 'react';
import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';
import {createManifest} from './createManifest';
type EncoderState = {
  resolution: string;
  bitRate: number;
  rate: number;
};
type EncodeI = {
  fileName: string;
  inputFile: string;
};
export const encode = ({fileName, inputFile}: EncodeI): Promise<any> => {
  const variations: EncoderState[] = [
    {
      resolution: '854:480',
      rate: 30,
      bitRate: 1250,
    },
    // {
    //   resolution: '854:480',
    //   rate: 30,
    //   bitRate: 1600,
    // },
  ];
  var status = 0;
  var videoPaths: string[] = [];

  let dirPath = `${RNFS.CachesDirectoryPath}/${fileName}`;
  RNFS.mkdir(dirPath);
  return new Promise(resolve => {
    // Encode Audio
    let audioPath = `${dirPath}/audio.webm`;

    FFmpegKit.executeAsync(
      `-hide_banner -i ${inputFile} -c:a libvorbis -b:a 192k -vn \
       -f webm -dash 1 ${audioPath}`,
      async session => {
        const state = await session.getState();
        const returnCode = await session.getReturnCode();
        const duration = await session.getDuration();

        if (ReturnCode.isSuccess(returnCode)) {
          console.log(`Encode completed successfully in ${duration} milliseconds; playing video.`);
        } else {
          console.log(`Encode failed with state ${state} and rc ${returnCode}.`);
        }
      },
    );
    variations.forEach(v => {
      let scale = v.resolution.split(':').join('x');

      let videoPath = `${dirPath}/${scale}-${v.rate}-${v.bitRate}k.webm`;
      videoPaths.push(videoPath);
      console.log(`Encoding ${videoPath}`);
      // without -speed {speed}

      // create folder

      // Encode Video
      FFmpegKit.executeAsync(
        `-hide_banner -y -i ${inputFile} -c:v libvpx-vp9 -keyint_min 150 \
         -g 150 -row-mt 1 -tile-columns 4 -frame-parallel 1 \
         -movflags faststart -speed 4  \
         -threads 8 -an -vf scale=${v.resolution} -b:v ${v.bitRate}k -r ${v.rate} \
         -f webm -dash 1 ${videoPath}`,
        async session => {
          // Unique session id created for this execution
          const sessionId = session.getSessionId();

          // Command arguments as a single string
          // const command = session.getCommand();

          // Command arguments
          // const commandArguments = session.getArguments();

          // State of the execution. Shows whether it is still running or completed
          const state = await session.getState();
          // console.log('State: ', state);

          // Return code for completed sessions. Will be undefined if session is still running or FFmpegKit fails to run it
          const returnCode = await session.getReturnCode();

          // const startTime = session.getStartTime();
          // console.log('Start time: ', startTime);
          // const endTime = await session.getEndTime();
          // console.log('End time: ', endTime);
          const duration = await session.getDuration();
          // console.log('Duration: ', duration);

          // Console output generated for this execution
          const output = await session.getOutput();
          console.log('Output : ', output);

          // The stack trace if FFmpegKit fails to run a command
          const failStackTrace = await session.getFailStackTrace();

          // The list of logs generated for this execution
          const logs = await session.getLogs();
          console.log(logs);
          if (ReturnCode.isSuccess(returnCode)) {
            resolve({videoPaths, audioPath, dirPath, fileName});

            console.log(
              `Encode completed successfully in ${duration} milliseconds; playing video.`,
            );
          } else {
            console.error(`Encode failed with state ${state} and rc ${returnCode}.`);
          }
          // The list of statistics generated for this execution (only available on FFmpegSession)
          // const statistics = await session.getStatistics();
        },
      );
    });
  });
};
