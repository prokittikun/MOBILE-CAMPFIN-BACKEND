export interface GoogleProfileData {
  id: string;
  displayName: string;
  name: GoogleNameData;
  emails: GoogleEmailData[];
  photos: GooglePhotoData[];
  provider: string;
}

export interface GoogleNameData {
  familyName: string;
  givenName: string;
}

export interface GoogleEmailData {
  value: string;
  verified: boolean;
}

export interface GooglePhotoData {
  value: string;
}

export interface Json {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
  hd: string;
}
