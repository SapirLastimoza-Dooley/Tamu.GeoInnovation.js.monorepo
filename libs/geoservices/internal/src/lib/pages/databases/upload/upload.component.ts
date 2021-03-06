import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DatabaseService } from '@tamu-gisc/geoservices/data-access';
import { ReplaySubject } from 'rxjs';
import { SelectedFile } from '@tamu-gisc/ui-kits/ngx/forms';

@Component({
  selector: 'tamu-gisc-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {
  public form: FormGroup;

  public delimiters = this.db.getTextDelimiterList();

  public qualifiers = this.db.getTextQualifierList();

  public file: ReplaySubject<SelectedFile> = new ReplaySubject(1);

  constructor(private fb: FormBuilder, private db: DatabaseService) {}

  public ngOnInit() {
    this.form = this.fb.group({
      file: ['', Validators.required],
      txtDelimiter: [','],
      txtQualifier: ['"']
    });
  }

  public upload() {
    console.log(this.form.getRawValue());
  }
}
