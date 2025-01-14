import { Component, OnInit } from '@angular/core';
import { UsersService } from './services/users.service'
import { UserListComponent } from './components/user-list/user-list.component'
import { FiltersComponent } from "./components/filters/filters.component";
import { LanguageService } from './services/language.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

const PAGE = 0;
const SIZE = 5000;

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [UserListComponent, FiltersComponent, ReactiveFormsModule],
    providers: [UsersService, LanguageService],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    form: any;
    constructor(public usersService: UsersService, public lang: LanguageService) { }

    ngOnInit(): void {
        this.usersService.getUsers(PAGE, SIZE).subscribe((users: any) => {
            this.usersService.allUsers = users;
            this.usersService.runWorker(this.usersService.setupUsers());
        });
        this.lang.getLanguage();
        this.form = new FormGroup({
            language: new FormControl(this.lang.locale.code)
        });
    }
}
