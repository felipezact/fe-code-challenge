import { User } from './user.model';

export interface UserPages {
    key: string;
    page: number;
    data: User[][];
}


export interface FilteredUsers {
    [initial: string]: User[];
}