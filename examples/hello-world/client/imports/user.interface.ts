import { Email } from './email.interface';

export interface User {
  firstName: string;
  lastName: string;
  emails: Email[];
}
