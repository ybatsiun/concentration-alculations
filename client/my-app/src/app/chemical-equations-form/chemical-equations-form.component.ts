import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";



@Component({
  selector: 'app-chemical-equations-form',
  templateUrl: './chemical-equations-form.component.html',
  styleUrls: ['./chemical-equations-form.component.css']
})
export class ChemicalEquationsFormComponent implements OnInit {

  constructor(private router: Router) { }
  model = new Equations('test');

  ngOnInit() {
  }

  getDifferentialEquations(){
    //do some logic
    this.router.navigateByUrl('/configConstants');
  }

}


class Equations {

  constructor(
      public equation:string,
  ) { }
}