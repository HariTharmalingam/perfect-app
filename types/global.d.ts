// Types existants
export type onboardingSwiperDataType = {
  id: number;
  title: string;
  description: string;
  sortDescrition: string;
  sortDescrition2?: string;
  image: any;
};

export type Avatar = {
  public_id: string;
  url: string;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  avatar?: Avatar;
  password?: string;
  courses: any;
  programs: any;
  createdAt: Date;
  updatedAt: Date;
};

export type BannerDataTypes = {
  bannerImageUrl: any;
};

export type programsDataType = {
  id: number;
  title: string;
  description: string;
  image: any;
};

export * from './programTypes';
