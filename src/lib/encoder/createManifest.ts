import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';
import {getMaps, getSets, getVideos} from './utils';

export const createManifest = (
  videoPaths: string[],
  audioPath: string,
  dirPath: string,
  fileName: string,
) => {
  let output = `${dirPath}/${fileName}.mpd`;
  console.log(getSets(videoPaths));
  const command = ` \
    ${getVideos(videoPaths)} \
    -f webm_dash_manifest -i ${audioPath} \   
    -c copy \
    ${getMaps(videoPaths)} \
    -f webm_dash_manifest \
    -adaptation_sets "${getSets(videoPaths)}" \
     ${output}`;
  FFmpegKit.executeAsync(command, async session => {
    const cmd = await session.getCommand();
    const state = await session.getState();
    console.log(state);
    const returnCode = await session.getReturnCode();
    const duration = await session.getDuration();

    if (ReturnCode.isSuccess(returnCode)) {
      console.log(`Created Manifest successfully in ${duration} milliseconds.`);
    } else {
      console.error(`Creating Manifest failed with state ${state} and rc ${returnCode}.`);
    }
  });
};
