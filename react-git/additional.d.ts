import 'little-state-machine';

declare module 'little-state-machine' {
  interface GlobalState {
    step: 'PhoneNumber' | 'Token' | 'Password';
    phoneNumber: string;
    token: string;
    password: string;
  }
}
