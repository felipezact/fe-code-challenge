import { Injectable } from '@angular/core';
import locales from '../../assets/locales.json';
import { HttpClient } from '@angular/common/http';

@Injectable(
    {
        providedIn: 'root'
    }
)
export class LanguageService {
    locales = locales;
    locale = this.locales[0];

    fallBackLocale = 'en-EN';
    entries: any = {};

    constructor(private http: HttpClient) {
        this.selectLocale();
        this.getLanguage();
    }

    selectLocale(): any {
        // navigatorLocales has a list of ordered prefered languages defined by the user in the browser
        const navigatorLocales = this.getNavigatorLocales();
        for (const navLocale of navigatorLocales) {
            // Check for a partial match using the locales.json file
            const currentLocale = this.locales.filter(el => el.code.toLowerCase().includes(navLocale));
            if (currentLocale && currentLocale[0] && currentLocale[0].code) {
                // Partial match found!
                this.locale = currentLocale[0];
                return;
            }
        }
    }

    getNavigatorLocales(): any {
        let navigatorLanguages;
        if (navigator.languages !== undefined) {
            navigatorLanguages = navigator.languages;
        } else {
            navigatorLanguages = [navigator.language];
        }
        return navigatorLanguages.map(el => el.split('-')[0]) || [];
    }

    updateLocale(newLocale: any): any {
        this.locale = locales.filter(l => l.code.toLowerCase() === newLocale.target.value.toLowerCase())[0];
        this.getLanguage();
    }

    getLanguage() {
        const loc = this.locale?.code ? this.locale.code.toLowerCase() : this.fallBackLocale.toLowerCase();
        const requestUrl = `translations/${loc}.json`;
        this.http.get(requestUrl).subscribe((res: any) => {
            const parsed: any = {};
            for (let key in res) {
                const subStr = key.split('_')[0];
                const newKey = key.replace(subStr + '_', '');
                if (!parsed[subStr]) {
                    parsed[subStr] = {};
                }
                parsed[subStr][newKey] = res[key];
            }
            this.entries = parsed;
        }, (err) => err);
    }

}
