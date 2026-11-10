export interface MicrosoftIdTokenClaims {
  iss: string;
  sub: string;
  tid: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  xms_edov?: boolean | string | number;
}
