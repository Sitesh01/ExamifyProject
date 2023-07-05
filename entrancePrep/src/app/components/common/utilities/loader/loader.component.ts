import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
  loader: any;
  constructor(private apiService: ApiService) {
    this.apiService.loader.subscribe((res) => {
      this.loader = res;
    });
  }
  ngOnInit() {}
}
