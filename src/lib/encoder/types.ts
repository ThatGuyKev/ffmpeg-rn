type Scale = {
  resolution: string;
  rate: number;
  bitRate: number;
};
export type Scales = Scale[];
export type CreateManifestI = (fileName: string, scales: Scales) => Promise<void>;
export type EncodeVP9I = (file: string, fileName: string, scales: Scales) => Promise<boolean>;
export type GetVideosI = (videoPaths: string[]) => string;
export type GetMapsI = (scales: Scales) => string;
export type GetSetsI = (scales: Scales) => string;
