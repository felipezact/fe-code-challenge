import { Component, input } from '@angular/core';
import { User } from '../../models/user.model'
import { UsersService } from '../../services/users.service';
import { LanguageService } from '../../services/language.service';

@Component({
    selector: 'app-user-item',
    standalone: true,
    templateUrl: './user-item.component.html',
    styleUrl: './user-item.component.scss',
})
export class UserItemComponent {
    constructor(public userService: UsersService, public lang: LanguageService) { }
    user = input.required<User>();
    showUser = false;
    visibility = {
        locked: '🔒',
        unlocked: '🔓'
    };
    showCredentials = false;

    privacy(field: any, show: boolean): string {
        return show ? field : field.replace(/./g, '*');
    }

    /**
     * Get the count of users with same nationality
     */
    get nationalitiesCount(): number {
        if (!this.userService.allUsers.length) {
            return 0
        }

        return this.userService.allUsers.reduce((acc, user) => {
            return user.nat === this.user().nat ? acc + 1 : acc
        }, 0)
    }
}
