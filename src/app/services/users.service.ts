import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { FilteredUsers, UserPages } from '../models/user-pages.model';
import locs from '../../assets/country-codes.json';

import { ApiResult } from '../models/api-result.model';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private pageSize = 200;
    specialLabel = 'internationalCharacters';
    alphabetList: string[] = [];
    countryList: string[] = [];
    currentFilter: string = 'alpha';
    users: UserPages[] = [];
    staticUsers: UserPages[] = [];
    allUsers: User[] = [];
    loading = false;
    searchQuery = '';

    private apiUrl = 'https://randomuser.me/api'

    constructor(private httpClient: HttpClient) { }

    /**
     * Fetches 5000 mock users from the api
     * @param {number} page
     * @param {number} results
     * @returns {Observable<User[]>}
     */
    getUsers(page = 0, results = 100): Observable<User[]> {
        this.loading = true;
        return this.httpClient
            .get<ApiResult>(`${this.apiUrl}?results=5000&&page=${page}`)
            .pipe(map(apiResult => User.mapFromUserResult(apiResult.results)))
    }

    /**
     * Maps the users to an array of UserPages with keys and pages
     * 
     * The decision to use a key-value pair is to make it easier to filter the users by their initials
     * Also the decision to use an array of pages is to make it easier to paginate the users
     * Both decisions are made to improve the performance of the application, as the calculations are done only once instead of every time the user interacts with the view
     * 
     * @param {User[]} users 
     * @returns {User[]}
     */
    setupUsers(): UserPages[] {
        this.loading = true;
        this.users = this.filterUsers(this.currentFilter, this.allUsers);
        this.staticUsers = this.users;
        this.loading = false;
        return this.users;
    }

    /**
     * Chunks an array into smaller arrays
     * @param {User} array 
     * @param {number} chunkSize 
     * @returns {User[][]}
     */
    chunkArray(array: User[], chunkSize: number): User[][] {
        const chunks: User[][] = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    }

    /**
     * Sets the number of nationalities for the current user
     * @param allUsers 
     * @param currentUser 
     * @returns {number}
     */
    setNationalitiesCounter(allUsers: User[], currentUser: User): number {
        if (!allUsers.length) {
            return 0
        }

        return allUsers.reduce((acc: any, user: any) => {
            return user.nat === currentUser.nat ? acc + 1 : acc
        }, 0)
    }

    /**
     * Filters the users by their initials
     * @param users 
     * @returns {FilteredUsers}§
     */
    filterUsersByInitials(users: User[]): FilteredUsers {
        return users.reduce((acc: any, user: User) => {
            let initial = user?.firstname?.charAt(0).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase() || '';
            if (!/^[a-z]$/.test(initial)) {
                initial = this.specialLabel;
            }
            if (!acc[initial]) {
                acc[initial] = [];
            }
            acc[initial].push(user);
            return acc;
        }, {});
    }

    /**
     * Filters the users based on the filter
     * @param filter 
     * @param users 
     * @returns {UserPages}
     */
    filterUsers(filter: string, users: any): any {
        let result: any = [];
        this.resetLists();
        switch (filter) {
            case 'alpha':
                const filteredUsers = this.filterUsersByInitials(users);
                this.alphabetList = Object.keys(filteredUsers).sort((a, b) => {
                    if (a === this.specialLabel) return 1;
                    if (b === this.specialLabel) return -1;
                    return a.localeCompare(b);
                });

                for (const i of this.alphabetList) {
                    const sortedList = filteredUsers[i].sort((a: any, b: any) => a.firstname.localeCompare(b.firstname));
                    result.push({
                        key: { label: i.toUpperCase(), value: i },
                        page: 0,
                        pageSize: sortedList.length,
                        data: this.chunkArray(sortedList, this.pageSize)
                    })
                }
                break;
            case 'nationality':
                const nationalities = users.reduce((acc: any, user: any) => {
                    if (!acc[user.nat]) {
                        acc[user.nat] = [];
                    }
                    acc[user.nat].push(user);
                    return acc;
                }, {});
                this.countryList = Object.keys(nationalities).sort((a, b) => a.localeCompare(b));
                for (const i of this.countryList) {
                    const cc = this.getCountryInfo(i);
                    result.push({
                        key: { label: cc, value: cc },
                        page: 0,
                        pageSize: nationalities[i].length,
                        data: this.chunkArray(nationalities[i], this.pageSize)
                    })
                }
                this.countryList = this.countryList.map((c: string) => this.getCountryInfo(c));
                break;
        }
        return result;
    }


    /**
     * Gets country information including name and flag
     * @param {string} countryCode
     * @returns {{ name: string, flag: string }}
     */
    getCountryInfo(countryCode: string): string {
        // Implement this method to return the country name and flag based on the country code
        // For example, you can use a predefined list or an external API to get this information
        const c = locs.filter(loc => loc.code === countryCode.toLowerCase())[0];
        if (!c) {
            return countryCode;
        }
        return `${c.name} ${c.flag}`;
    }

    resetLists(): void {
        this.alphabetList = [];
        this.countryList = [];
    }


    filterByString(value: any): any {
        this.loading = true;
        this.searchQuery = '';
        if (value) {
            const filtered = this.allUsers.filter((user: any) => {
                const name = `${user.firstname} ${user.lastname}`;
                return name.toLowerCase().indexOf(value) != -1;
            })
            this.resetLists();
            this.users = this.filterUsers(this.currentFilter, filtered);
            this.searchQuery = value;
        }
        this.loading = false;
    }

    runWorker(cb: any): void {
        if (typeof Worker !== 'undefined') {
            // Create a new
            const worker = new Worker(new URL('../app.worker', import.meta.url));
            worker.postMessage(cb);
        } else {
            // Web Workers are not supported in this environment.
            // You should add a fallback so that your program still executes correctly.
        }
    }

}
