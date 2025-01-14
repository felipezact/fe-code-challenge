import { NgClass } from '@angular/common';
import { UsersService } from './../../services/users.service';
import { Component } from '@angular/core';
import { LanguageService } from '../../services/language.service';

@Component({
    selector: 'app-filters',
    standalone: true,
    imports: [NgClass],
    templateUrl: './filters.component.html',
    styleUrl: './filters.component.scss'
})
export class FiltersComponent {
    filters = ['alpha', 'nationality'];
    currentFilter = 'alpha';

    constructor(public userService: UsersService, public lang: LanguageService) { }

    filter(filter: string): void {
        this.currentFilter = filter;
        if (this.currentFilter !== this.userService.currentFilter) {
            this.userService.currentFilter = this.currentFilter;
            this.userService.runWorker(this.userService.setupUsers());
            if (this.userService.searchQuery.length >= 3) {
                this.userService.runWorker(this.userService.filterByString(this.userService.searchQuery));
            }
        }
    }

    search(event: any): void {
        if (event?.target?.value.length >= 3) {
            this.userService.runWorker(this.userService.filterByString(event?.target?.value));
        } else if (this.userService.users.length !== this.userService.staticUsers.length) {
            this.userService.searchQuery = '';
            this.userService.runWorker(this.userService.users = this.userService.staticUsers);
        }
    }

    scrollTo(id: string) {
        document.getElementById(id)!.scrollIntoView({ behavior: 'smooth' });
    }
}
