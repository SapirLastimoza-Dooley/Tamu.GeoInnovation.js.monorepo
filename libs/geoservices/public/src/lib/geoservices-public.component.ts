import { Component, OnInit } from '@angular/core';
import { ResponsiveService } from '@tamu-gisc/dev-tools/responsive';

@Component({
  selector: 'tamu-gisc-geoservices-public',
  templateUrl: './geoservices-public.component.html',
  styleUrls: ['./geoservices-public.component.scss']
})
export class GeoservicesPublicComponent implements OnInit {
  constructor(public rp: ResponsiveService) {}

  public ngOnInit() {}
}