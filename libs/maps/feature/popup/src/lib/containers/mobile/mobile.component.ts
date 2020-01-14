import { Component, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import { PopupComponent } from '../base/base.component';

import { EsriMapService } from '@tamu-gisc/maps/esri';
import { PopupService } from '../../services/popup.service';
import { DragService } from '@tamu-gisc/ui-kits/ngx/interactions/draggable';

@Component({
  selector: 'tamu-gisc-feature-mobile-popup',
  templateUrl: './mobile.component.html',
  styleUrls: ['./mobile.component.scss'],
  providers: [PopupService]
})
export class PopupMobileComponent extends PopupComponent implements OnDestroy {
  /**
   * Guid string identifier generated by the DragService and passed into the draggable directive by attribute input.
   *
   * This allows the service and directive to update the drag state which can be accessed by the parent component.
   */
  public identifier: string;

  constructor(
    private ms: EsriMapService,
    private ps: PopupService,
    private cr: ComponentFactoryResolver,
    private dragService: DragService
  ) {
    super(ms, ps, cr);

    this.identifier = dragService.register(this);
  }

  public ngOnDestroy() {
    // Call base class on destroy method
    super.ngOnDestroy();

    // Perform sub-class-specific on destroy logic
    this.dragService.unregister(this.identifier);
  }
}