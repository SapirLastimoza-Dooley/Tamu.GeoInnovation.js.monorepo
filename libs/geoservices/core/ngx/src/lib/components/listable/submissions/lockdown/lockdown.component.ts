import { Component, OnDestroy, OnInit } from '@angular/core';
import { County, FieldCategory } from '@tamu-gisc/covid/common/entities';
import { CountyClaimsService, PhoneNumbersService, PhoneNumberTypesService, TestingSitesService, WebsitesService, WebsiteTypesService, FormattedTestingSite } from '@tamu-gisc/geoservices/data-access';
import { Observable, VirtualTimeScheduler } from 'rxjs';
import { map } from 'rxjs/operators';
import { CATEGORY } from '@tamu-gisc/covid/common/enums';

@Component({
  selector: 'tamu-gisc-lockdown-list',
  templateUrl: './lockdown.component.html',
  styleUrls: ['./lockdown.component.scss']
})
export class LockdownListComponent implements  OnInit, OnDestroy {
  public counties: Observable<Array<Partial<County>>>;
  public testingSites: Observable<Array<Partial<FormattedTestingSite>>>;
  public phoneTypes: Observable<Partial<FieldCategory>>;
  public websiteTypes: Observable<Partial<FieldCategory>>;

  constructor(
    private pt: PhoneNumberTypesService,
    private pn: PhoneNumbersService,
    private wt: WebsiteTypesService,
    private ws: WebsitesService,
    private cl: CountyClaimsService,
    private ts: TestingSitesService,
  ) { }

  ngOnInit() {
    this.testingSites = this.ts.getTestingSitesSortedByCounty().pipe(
      map((sites) => {
        console.log("blah");
        sites.forEach((val) => {
          const responses = val.info.responses;
          responses.forEach((response, i) => {
            if (response.entityValue.value.category.id === CATEGORY.WEBSITES) {
              val.info.notes = response.entityValue.value.value
            }
          });
        });
        return sites;
      })
    );
  }

  ngOnDestroy() {
    // this._$destroy.next();
    // this._$destroy.complete();
  }

  

}