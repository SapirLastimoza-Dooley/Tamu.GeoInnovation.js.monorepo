import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { switchMap, pluck, withLatestFrom, filter, takeUntil, take } from 'rxjs/operators';

import { County, User, FieldCategory, EntityValue } from '@tamu-gisc/covid/common/entities';
import {
  WebsiteTypesService,
  StatesService,
  LockdownsService,
  PhoneNumberTypesService
} from '@tamu-gisc/geoservices/data-access';
import { IdentityService } from '@tamu-gisc/geoservices/core/ngx';
import { DeepPartial } from 'typeorm';

const storageOptions = { primaryKey: 'tamu-covid-vgi' };

@Component({
  selector: 'tamu-gisc-lockdown',
  templateUrl: './lockdown.component.html',
  styleUrls: ['./lockdown.component.scss']
})
export class LockdownComponent implements OnInit, OnDestroy {
  public form: FormGroup;

  public websitesTypes: Observable<Partial<FieldCategory>>;
  public phoneTypes: Observable<Partial<FieldCategory>>;

  public localCounty: Observable<DeepPartial<County>>;
  public localEmail: Observable<Partial<User['email']>>;

  public lockdownState: Observable<boolean>;

  private _$destroy: Subject<boolean> = new Subject();

  public lockdownOptions = [
    {
      value: 'true',
      label: 'Yes'
    },
    {
      value: 'false',
      label: 'No'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private cl: WebsiteTypesService,
    private st: StatesService,
    private ls: LockdownsService,
    private ph: PhoneNumberTypesService,
    private is: IdentityService
  ) {}

  public ngOnInit() {
    this.localCounty = this.is.identity.pipe(pluck('claim', 'county'));
    this.localEmail = this.is.identity.pipe(pluck('user', 'email'));

    this.form = this.fb.group({
      claim: this.fb.group({
        user: ['', Validators.required],
        county: ['']
      }),
      location: this.fb.group({
        address1: [''],
        address2: [''],
        city: [''],
        zip: [''],
        county: ['', Validators.required],
        state: ['', Validators.required]
      }),
      info: this.fb.group({
        isLockdown: [[]],
        startDate: [new Date().toISOString().split('T')[0]],
        endDate: [new Date().toISOString().split('T')[0]],
        protocol: [''],
        notes: [''],
        phoneNumbers: this.fb.array([]),
        websites: this.fb.array([])
      })
    });

    this.websitesTypes = this.cl.getWebsiteTypes();
    this.phoneTypes = this.ph.getPhoneNumberTypes();

    // Since I don't have a dedicated radio or radio group component, need to control the selection logic by mapping an array to a boolean
    this.lockdownState = (this.form.controls.info as FormGroup).controls.isLockdown.valueChanges.pipe(
      switchMap((value) => {
        if (value.length > 1 || value.length === 0) {
          return of(undefined);
        } else if (value[0] === 'false') {
          return of(false);
        } else if (value[0] === 'true') {
          return of(true);
        }
      })
    );

    // Set the county and state location fields for the form

    this.localCounty
      .pipe(filter((county) => county !== undefined && county.countyFips !== undefined && county.stateFips !== undefined))
      .subscribe((county) => {
        if (county) {
          this.st.getStateByFips(county.stateFips).subscribe((state) => {
            this.form.patchValue({
              claim: {
                county: county.countyFips
              },
              location: {
                county: county.name,
                state: state.name
              }
            });
          });
        }
      });

    // Patch the form value with the local email value
    this.localEmail
      .pipe(
        filter((email) => email !== undefined),
        take(1)
      )
      .subscribe((email) => {
        this.form.patchValue({
          claim: {
            user: email
          }
        });
      });

    this.localEmail
      .pipe(
        filter((email) => email !== undefined),
        switchMap((email) => {
          return this.ls.getActiveLockdownForEmail(email);
        }),
        withLatestFrom(this.localEmail),
        takeUntil(this._$destroy)
      )
      .subscribe(([res, email]) => {
        if (Object.keys(res).length > 0) {
          const merged = {
            claim: {
              user: email,
              county: res.claim.county.countyFips
            },
            location: {
              address1: res.location.address1,
              address2: res.location.address2,
              city: res.location.city,
              zip: res.location.zip,
              county: res.location.county,
              state: res.location.state
            },
            info: {
              isLockdown: [res.info.isLockdown.toString()],
              startDate:
                res && res.info && res.info.startDate
                  ? ((res.info.startDate as unknown) as string).split('T')[0]
                  : this.form.get(['info', 'startDate']).value,
              endDate:
                res && res.info && res.info.endDate
                  ? ((res.info.endDate as unknown) as string).split('T')[0]
                  : this.form.get(['info', 'endDate']).value,
              protocol: res.info.protocol,
              notes: res.info.notes
            }
          };

          this.form.patchValue(merged);
        } else {
          const merged = {
            claim: {
              user: email
            }
          };

          this.form.patchValue(merged);
        }

        // if (res && res.info && res.info.phoneNumbers) {
        //   const phc = this.form.get(['info', 'phoneNumbers']) as FormArray;
        //   res.info.phoneNumbers.forEach((n) => phc.push(this.createPhoneNumberGroup(n)));
        // }

        // if (res && res.info && res.info.websites) {
        //   const wc = this.form.get(['info', 'websites']) as FormArray;
        //   res.info.websites.forEach((w) => wc.push(this.createWebsiteGroup(w)));
        // }
      });
  }

  public ngOnDestroy() {
    this._$destroy.next();
    this._$destroy.complete();
  }

  public createPhoneNumberGroup(number?: Partial<EntityValue>): FormGroup {
    return this.fb.group(this.createPhoneNumber(number));
  }

  public createWebsiteGroup(website?: Partial<EntityValue>): FormGroup {
    return this.fb.group(this.createWebsite(website));
  }

  public createPhoneNumber(number?: Partial<EntityValue>) {
    return {
      value: this.fb.group({
        value: number && number.value && number.value.value,
        type: number && number.value && number.value.type
      })
    };
  }

  public createWebsite(website?: Partial<EntityValue>) {
    return {
      value: this.fb.group({
        value: website && website.value && website.value.value,
        type: website && website.value && website.value.type
      })
    };
  }

  /**
   * Push a phone number form group to the form array
   */
  // public addPhoneNumber() {
  //   (this.form.get(['info', 'phoneNumbers']) as FormArray).push(this.createPhoneNumberGroup());
  // }

  // public addWebsite() {
  //   (this.form.get(['info', 'websites']) as FormArray).push(this.createWebsiteGroup());
  // }

  public submitLockdown() {
    const lockdown = this.form.getRawValue();

    lockdown.info.isLockdown = lockdown.info.isLockdown[0] === 'true' ? true : false;
    lockdown.info.startDate = lockdown.info.isLockdown === true ? lockdown.info.startDate : undefined;
    lockdown.info.endDate = lockdown.info.isLockdown === true ? lockdown.info.endDate : undefined;

    return this.ls.submitLockdown(lockdown).subscribe((res) => {
      console.log('Lockdown submit response:', res);
    });
  }
}