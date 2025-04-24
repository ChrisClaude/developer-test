import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  AsyncPipe,
  CurrencyPipe,
  DecimalPipe,
  DatePipe,
} from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';

import { Observable } from 'rxjs';
import {
  map,
  startWith,
  finalize,
  tap,
  debounceTime,
  distinctUntilChanged,
  combineLatestWith,
} from 'rxjs/operators';
import { NgbHighlight } from '@ng-bootstrap/ng-bootstrap';
import { ApiService, MappedUserDto } from './services/api.service';
import { parseISO } from 'date-fns';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    NgbHighlight,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  users$!: Observable<MappedUserDto[]>;
  private users: MappedUserDto[] = [];
  filter = new FormControl('', { nonNullable: true });
  icons: { [key: string]: string } = {};
  private loadingIcons = new Set<string>();
  isLoading = false;

  constructor(private apiService: ApiService, pipe: DecimalPipe) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.users$ = this.apiService.getUsers().pipe(
      finalize(() => (this.isLoading = false)),
      map((users) =>
        users
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((user) => ({
            ...user,
            registered: parseISO(
              user.registered.substring(0, user.registered.indexOf('T'))
            ),
            balance: parseFloat(user.balance.replace(/,/g, '')),
          }))
      ),
      tap((users) => {
        this.users = users;
        users.forEach((user) => {
          this.icons[user.iconPath] = '';
        });
        this.getAllIcons();
      }),
      combineLatestWith(
        this.filter.valueChanges.pipe(
          startWith(''),
          debounceTime(300),
          distinctUntilChanged()
        )
      ),
      map(([users, filterText]) => {
        const term = filterText.toLowerCase();
        return users.filter(user => user.name.toLowerCase().includes(term));
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAllIcons() {
    const keys = Object.keys(this.icons);
    const batchSize = 3;

    for (let i = 0; i < keys.length; i += batchSize) {
      const batch = keys.slice(i, i + batchSize);
      batch.forEach((key) => this.loadIcon(key));
    }
  }

  private loadIcon(key: string): void {
    if (this.icons[key] !== '' || this.loadingIcons.has(key)) {
      return;
    }

    this.loadingIcons.add(key);
    this.apiService
      .getIcon(key)
      .pipe(
        map((icon) => `data:image/png;base64,${icon}`),
        catchError((error) => {
          console.error(`Failed to load icon ${key}:`, error);
          return of('unknown.png');
        }),
        finalize(() => this.loadingIcons.delete(key))
      )
      .subscribe((iconPath) => {
        this.icons[key] = iconPath;
      });
  }

  getIcon(name: string) {
    const icon = this.icons[name];
    if (icon) {
      return icon;
    }
    // Load the icon if it hasn't been loaded yet
    this.loadIcon(name);
    return '';
  }

  resetBalance() {
    this.users.forEach((user) => {
      user.balance = 0;
    });

    this.users$ = of(this.users);
  }
}
