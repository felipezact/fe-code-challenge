import { Component, input } from '@angular/core';
import { UserItemComponent } from '../user-item/user-item.component';
import { UsersService } from '../../services/users.service';
import { NgClass } from '@angular/common';
import { LanguageService } from '../../services/language.service';

@Component({
    selector: 'app-user-list',
    standalone: true,
    templateUrl: './user-list.component.html',
    styleUrl: './user-list.component.scss',
    imports: [
        NgClass,
        UserItemComponent
    ]
})
export class UserListComponent {
    users: any = input.required<any>();
    windowScrolled = false;

    constructor(
        public userService: UsersService,
        public lang: LanguageService
    ) {
        window.addEventListener('scroll', () => {
            this.windowScrolled = window.pageYOffset !== 0;
        });
    }
    /**
     * Scroll event handler (Infinte scrolling)
     * @param event 
     * @param user 
     */
    onScroll(event: any, user: any): void {
        const tableViewHeight = event.target.offsetHeight; // viewport: ~500px
        const tableScrollHeight = event.target.scrollHeight; // length of all table
        const scrollLocation = event.target.scrollTop; // how far user scrolled
        // If the user has scrolled within 1px of the bottom, add more data
        const buffer = 1;
        const limit = tableScrollHeight - tableViewHeight - buffer;
        if (scrollLocation > limit) {
            user.page++;
        }
    }

    /**
     * Scroll to top of the page
     */
    scrollToTop(): void {
        document.getElementById('header')!.scrollIntoView({ behavior: 'smooth' });
    }
}
