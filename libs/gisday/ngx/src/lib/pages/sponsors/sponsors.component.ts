import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'tamu-gisc-sponsors',
  templateUrl: './sponsors.component.html',
  styleUrls: ['./sponsors.component.scss']
})
export class SponsorsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.changeRank('point');
  }

  public changeRank(rank: string) {
    this.clearAllOtherPlaques();
    this.setPlaqueVisibleStatus(rank);
  }

  public clearAllOtherPlaques() {
    document.querySelectorAll('.plaque').forEach((elem) => {
      elem.classList.remove('active');
    });

    document.querySelectorAll('.content-block').forEach((elem) => {
      elem.classList.remove('visible');
    });
  }

  public setPlaqueVisibleStatus(rank: string) {
    let plaque = document.querySelector(`[rank=${rank}]`);
    let content = document.querySelector(`.content-block[rank=${rank}]`);

    if (plaque) {
      plaque.classList.add('active');
    }

    if (content) {
      content.classList.add('visible');
    }
  }
}
