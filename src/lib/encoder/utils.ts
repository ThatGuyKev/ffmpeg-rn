import {GetMapsI, GetSetsI, GetVideosI} from './types';

export const getVideos: GetVideosI = videoPaths => {
  return videoPaths.reduce(
    (a, c) =>
      a +
      ` \
    -f webm_dash_manifest -i ${c} `,
    '',
  );
};
export const getMaps = (videoPaths: string[]) => {
  return videoPaths.reduce((a, c, i) => a + ` -map ${i + 1}`, '-map 0');
};
export const getSets = (videoPaths: string[]) => {
  return videoPaths.reduce(
    (a, c, i) =>
      i + 1 == videoPaths.length ? a + `${i} id=1,streams=${videoPaths.length}` : a + `${i},`,
    `id=0,streams=`,
  );
};
