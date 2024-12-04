// Types existants (inchangés)
export type onboardingSwiperDataType = {
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

interface ProgramOption {
  location: string;
  programId?: string;
  stripePriceId: string;
}

interface PriceTier {
  duration: string;
  price: number;
  isCombo?: boolean;
  options: ProgramOption[];
}

export type programsDataType = {
  id: number;
  title: string;
  description: string;
  image: string;
  priceTiers: PriceTier[];
};

// Type de souscription inchangé
export type subscriptionDataType = {
  stripeProductId: string;
  stripePriceId: string;
  price: number;
  interval: string;
};
