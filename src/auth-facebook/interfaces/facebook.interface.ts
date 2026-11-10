export interface FacebookInterface {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface FacebookDebugTokenInterface {
  data?: {
    app_id?: string;
    is_valid?: boolean;
    user_id?: string;
  };
}
