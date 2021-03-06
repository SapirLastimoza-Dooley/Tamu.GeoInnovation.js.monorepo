import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { ResponseType } from '@tamu-gisc/oidc/common';
import { ResponseTypesService } from '@tamu-gisc/oidc/admin-data-access';

@Component({
  selector: 'edit-response-types',
  templateUrl: './edit-response-types.component.html',
  styleUrls: ['./edit-response-types.component.scss']
})
export class EditResponseTypesComponent implements OnInit {
  public $responseTypes: Observable<Array<Partial<ResponseType>>>;

  constructor(private readonly responseService: ResponseTypesService) {
    this.fetchResponseTypes();
  }

  public ngOnInit(): void {}

  public fetchResponseTypes() {
    this.$responseTypes = this.responseService.getResponseTypes().pipe(shareReplay(1));
  }

  public deleteResponseType(responseType: ResponseType) {
    console.log('Deleting...', responseType);
    this.responseService.deleteResponseType(responseType).subscribe((deleteStatus) => {
      console.log('Deleted ', responseType.guid);
      this.fetchResponseTypes();
    });
  }
}
