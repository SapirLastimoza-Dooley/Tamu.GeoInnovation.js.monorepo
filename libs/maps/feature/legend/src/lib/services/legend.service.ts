import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { EnvironmentService } from '@tamu-gisc/common/ngx/environment';
import { LayerListService } from '@tamu-gisc/maps/feature/layer-list';
import { LayerSource, LegendItem } from '@tamu-gisc/common/types';

import esri = __esri;

@Injectable()
export class LegendService {
  private _store: BehaviorSubject<LegendItem[]> = new BehaviorSubject([]);
  public store: Observable<LegendItem[]> = this._store.asObservable();

  constructor(private layerListService: LayerListService, private environment: EnvironmentService) {
    const LegendSources = this.environment.value('LegendSources');
    // Handle automatic layer addition and removal legend item display.
    // This does not handle removal on layer visibility change
    this.layerListService.layers({ watchProperties: 'visible' }).subscribe((value) => {
      const layersLegendItems = value
        .filter((item) => item.layer && item.layer.visible && item.outsideExtent === false)
        .filter((lyr) => (<LayerSource>(<unknown>lyr.layer)).legendItems)
        .map((lyr) => (<LayerSource>(<unknown>lyr.layer)).legendItems)
        .map((obj) => obj[0]);

      this._store.next([...LegendSources, ...layersLegendItems]);
    });
  }

  /**
   * Determines if the provided layer contains legend items and displays/hides them based on layer display value
   */
  public toggleLayerLegendItems(layer: esri.Layer): void {
    // Check if the layer has legend items to begin with.
    if ((<LayerSource>(<unknown>layer)).legendItems && (<LayerSource>(<unknown>layer)).legendItems.length > 0) {
      // If the layer visibility is true, add the legend item.
      if (layer.visible) {
        this.addMany((<LayerSource>(<unknown>layer)).legendItems);
      } else {
        // If the layer visibility is false, remove the legend item.
        this.removeMany((<LayerSource>(<unknown>layer)).legendItems);
      }
    }
  }

  /**
   * Tests an item id reference against the store to determine if the item exists.
   *
   * @param {string} id Valid legend item id reference
   * @returns {boolean} Returns true if it exists, false if it does not
   */
  public itemExists(id: string): boolean {
    return this._store.value.findIndex((item) => item.id === id) > -1;
  }

  /**
   * Updates the service store with an array of items.
   *
   * Checks if the items being added exist before adding anything, to avoid duplicates.
   */
  public addMany(items: LegendItem[]): void {
    // List of items that need to be added, that do not exist yet
    const toAdd = items.filter((item) => !this.itemExists(item.id));

    // Set concatenate current store with items to add
    this._store.next([...this._store.value, ...toAdd]);
  }

  /**
   * Updates the service store excluding the items provided.
   */
  public removeMany(items: LegendItem[]): void {
    // Array of ID's that do not exists, and should be marked for removal.
    const idsToRemove = items.filter((item) => this.itemExists).map((item) => item.id);

    // New filtered array that does not include the items marked for removal.
    const removed = this._store.value.filter((storeItem) => !idsToRemove.includes(storeItem.id));

    // Set new store value with removed items
    this._store.next([...removed]);
  }
}
