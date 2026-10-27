import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  ViewChild
} from '@angular/core';

import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-grafico',
  imports: [],
  templateUrl: './grafico.html',
  styleUrl: './grafico.css',
})
export class Grafico implements OnChanges, OnDestroy {

  @ViewChild('lienzo', { static: true })
  lienzoRef!: ElementRef<HTMLCanvasElement>;

  @Input({ required: true })
  config!: ChartConfiguration;

  private chart: Chart | null = null;

  ngOnChanges(): void {

    if (!this.config) {
      return;
    }

    this.chart?.destroy();

    this.chart = new Chart(
      this.lienzoRef.nativeElement,
      this.config
    );

  }

  ngOnDestroy(): void {

    this.chart?.destroy();

  }
}
