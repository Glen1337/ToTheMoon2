import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ResearchDataService } from '../Services/research-data.service';
import { Location } from '@angular/common';
import { IAgg } from '../Models/ResearchData';
// import  'anychart';
import { Subscription } from 'rxjs';
import '../../../node_modules/anychart/';
import { FinancialPage } from '../Common/FinancialPage';

@Component({
  selector: 'app-research',
  templateUrl: './research.component.html',
  styleUrls: ['./research.component.css']
})
export class ResearchComponent extends FinancialPage implements OnInit, AfterViewInit, OnDestroy {

  private chart: anychart.charts.Stock;
  public historicalStockData: IAgg[] = [];
  public visible: boolean = false;

  @ViewChild('chartContainer') container!: ElementRef;

  public researchForm = new FormGroup({
    researchSymbolControl: new FormControl('', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(8)
    ])
  });

  constructor(private researchService: ResearchDataService, public location: Location, private route: ActivatedRoute) {
    super();
    this.chart = anychart.stock();
  }

  ngOnInit(): void { }

  ngAfterViewInit(): void{ }

  get researchSymbolControl() { return this.researchForm.get('researchSymbolControl'); }

  onGetData(): void {
    let subscription1: Subscription = new Subscription();
    let symbol: string = this.researchSymbolControl!.value;

    subscription1 = this.researchService.getHistoricalstockData(symbol).subscribe({
      next: (data) => {
        this.historicalStockData = data;
        this.ChartData(data);
        this.visible = true;
      },
      error: (error) => {
        console.log('(component)Error in getting research: ', error);
        this.errorMsg = `${error.error}`;
      },
      complete: () => {'(component)Research retrieval complete'}
    });

    this.subscriptions.push(subscription1);
  }

  private ChartData(inputData: any[]): void{
    const fontWeight = 1000;

    let ticker: string = String(this.researchSymbolControl?.value).trim().toUpperCase();

    // Clear existing chart
    if(this.chart) {
      this.chart.dispose();
    }

    // Create table
    let table = anychart.data.table();

    // Create data mapping

    // Create chart
    this.chart = anychart.stock();

    // Format data and add it to table
    let data = this.ConvertIAggArrayToArrayOfArrays(inputData);
    table.addData(data);

    // Begin charts

    //plot0: candlestick
    let quoteMapping = table.mapAs({'open':1, 'high':2, 'low':3, 'close':4, 'value':4});
    let plot0 = this.chart.plot(0);
    plot0.candlestick(quoteMapping).name(ticker)
      .risingFill('#66ff66')
      .risingStroke('#66ff66')
      .fallingFill('#ff3300')
      .fallingStroke('ff3300'); // for area plot: .fill('#3248EC').stroke("#45F4FC");

    // plot0 settings
    plot0.yMinorGrid().palette(['LightGrey', null]);
    plot0.title(`${ticker} Price`);
    plot0.title().fontWeight(fontWeight).fontSize(16);
    plot0.xAxis().ticks(true).minorTicks(true);
    plot0.yAxis().ticks(true).minorTicks(true);
    plot0.xAxis().background('#CCFFFF').height(40);
    plot0.crosshair().xStroke('#ca68ff', 1.6, 'round');
    plot0.crosshair().yStroke('#ca68ff', 1.6, 'round');
    plot0.xAxis().labels().fontWeight(fontWeight);
    plot0.yAxis().labels().fontWeight(fontWeight);
    plot0.xAxis().minorLabels().fontWeight(fontWeight);
    plot0.yAxis().minorLabels().fontWeight(fontWeight);
    plot0.legend().fontWeight(fontWeight);
    //plot0.yScale().maximum(65).minimum(55);

    // EMAs on 1st plot
    let ema5 = plot0.ema(quoteMapping, 5).series();
    let ema20 = plot0.ema(quoteMapping, 20).series();

    // plot1: volume
    let volMapping = table.mapAs({'value': 5});
    let plot1 = this.chart.plot(1);
    plot1.column(volMapping).name('Volume').fill('#3cbda9');

    // plot1 settings
    plot1.yGrid().stroke({dash: '2 14'});
    plot1.title(`${ticker} Volume`);
    plot1.title().fontWeight(fontWeight).fontSize(16);
    plot1.xAxis().ticks(true).minorTicks(true);
    plot1.yAxis().ticks(true).minorTicks(true);
    plot1.xAxis().background('#CCFFFF').height(40);
    plot1.crosshair().xStroke('#ca68ff', 1.6, 'round');
    plot1.crosshair().yStroke('#ca68ff', 1.6, 'round');
    plot1.xAxis().labels().fontWeight(fontWeight);
    plot1.yAxis().labels().fontWeight(fontWeight);
    plot1.xAxis().minorLabels().fontWeight(fontWeight);
    plot1.yAxis().minorLabels().fontWeight(fontWeight);
    plot0.legend().fontWeight(fontWeight);

    // Volume y axis labels
    plot1.yAxis().labels().position('left').anchor('left');

    // configure scroller
    this.chart.scroller().fill('#D1F37D');
    this.chart.scroller().selectedFill('#BFE6A9');
    this.chart.scroller().area(quoteMapping).fill('#c4b237');
    let labels = this.chart.scroller().xAxis().labels().fontWeight(600).fontColor('#464646');
    let minorLabels = this.chart.scroller().xAxis().minorLabels().fontWeight(600).fontColor('#464646');

    // Chart padding
    this.chart.padding('2%', 2, 2, '3%');

    // Disable grouping
    let grouping = this.chart.grouping();
    grouping.enabled(false);

    // Display chart
    this.chart.container(this.container.nativeElement);
    this.chart.draw();
  }


  ConvertIAggArrayToArrayOfArrays(inputArray: IAgg[]): any[][]{
    let arrayOfArrays: any[][] = [];
    inputArray.forEach((agg) => {
      arrayOfArrays.push([ new Date(agg.timeUtc).toLocaleDateString(), agg.open, agg.high, agg.low, agg.close, agg.volume]);
    });
    return arrayOfArrays;
  }

}
