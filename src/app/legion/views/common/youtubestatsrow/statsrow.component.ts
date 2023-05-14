import { ChangeDetectionStrategy } from "@angular/compiler";
import { Component, OnInit, AfterContentInit } from "@angular/core";

@Component({
  selector: 'stats-row',
  templateUrl: './statsrow.component.html',
  styleUrls: ['./statsrow.component.scss'],
  // changeDetection: ChangeDetectionStrategy.Default,
})
export class StatsRowComponent implements OnInit, AfterContentInit {

  ngOnInit(): void {
    throw new Error("Method not implemented.");
  }
  ngAfterContentInit(): void {
    throw new Error("Method not implemented.");
  }

}
