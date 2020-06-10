export interface ILoginAccountData {
  username: string;
  password?: string;
  licenseHash?: string;
  socialClub: string;
  socialId?: string;
  discordUserID?: string | undefined;
}
