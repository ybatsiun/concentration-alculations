import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { DataService } from '../services/data.service';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { HttpClientService } from '../services/http-client.service';

@Component({
  selector: 'app-config-constants-form',
  templateUrl: './config-constants-form.component.html',
  styleUrls: ['./config-constants-form.component.css']
})
export class ConfigConstantsFormComponent implements OnInit {
  htmlConstants; configForm; form; reagents; equationData;

  constructor(private router: Router, private data: DataService, private fb: FormBuilder, private httpCLient: HttpClientService) { }

  ngOnInit() {
    this.getConstants();
  };

  getConstants() {
    this.data.currentDifferentialEquationsSystem.subscribe(message => {
      this.equationData = message;
      let rawHtml = message.map(e => e.html).toString();
      this.reagents = message.map(e => e.reagent);
      //get html representration of constants and sort unique values
      this.htmlConstants = rawHtml.match(/k<sub>\d<\/sub>/g).filter((value, index, self) => {
        return self.indexOf(value) === index;
      }).sort((a, b) => Number.parseInt(a.match(/\d/)[0]) - Number.parseInt(b.match(/\d/)[0]));
      
      this.form = this.fb.group({
        config: this.fb.group({
          speedConstants: this.fb.array([]),
          calculationConfig: this.fb.group({
            initialConcentrations: this.fb.array([]),
            timeInterval: this.fb.group({
              start: this.fb.control(0),
              finish: this.fb.control(10)
            }),
            partsToDivide: this.fb.control(2)
          })
        }),
        experimentalData: this.fb.control('[ [ 6.0, 0.0, 8.0, 0.0 ], [ 0.41736666246662857, 0.011995443449753843, 0.5804797701883523, 3.709760114905822 ], [ 0.29642027654506103, 0.008445576168741278, 0.41211818773090386, 3.7939409061345466 ], [ 0.2427044169569831, 0.006870248870426924, 0.3373463870168379, 3.831326806491579 ], [ 0.2106489423890902, 0.005930863740708429, 0.29272698400021036, 3.8536365079998935 ], [ 0.18875879841343932, 0.0052898335957445985, 0.2622580650760815, 3.8688709674619584 ], [ 0.172592470027359, 0.004816746410379318, 0.23975678619057725, 3.8801216069047104 ], [ 0.16002324902712073, 0.00444916988074192, 0.22226267179765138, 3.8888686641011736 ], [ 0.1498882606518915, 0.0041529728445490344, 0.20815695989162666, 3.8959215200541863 ], [ 0.14149094544841806, 0.003907716056895382, 0.19647002604502142, 3.901764986977489 ], [ 0.13438527355714017, 0.003700310798791635, 0.18658098634044346, 3.906709506829778 ], [ 0.12827063501029695, 0.003521938847980091, 0.17807139104302938, 3.9109643044784845 ], [ 0.12293606154586666, 0.003366415940891531, 0.1706475806096119, 3.914676209695194 ], [ 0.11822854661462205, 0.0032292535275939903, 0.16409656920802398, 3.9179517153959877 ], [ 0.11403405787708636, 0.0031071085278532467, 0.15825962755849493, 3.920870186220752 ], [ 0.11026563837363851, 0.002997432068530244, 0.15301571530191846, 3.9234921423490396 ], [ 0.10685566068826635, 0.002898242205706875, 0.14827069866244216, 3.925864650668778 ], [ 0.10375063858721885, 0.002807971693521055, 0.14395012817000719, 3.9280249359149955 ], [ 0.10090761759040014, 0.00272536212017143, 0.13999421436088297, 3.930002892819558 ], [ 0.0982916773289971, 0.00264939061725529, 0.13635435100651327, 3.9318228244967424 ], [ 0.09587408477366764, 0.002579215702288195, 0.13299054443613978, 3.933504727781929 ], [ 0.09363094818383091, 0.002514137798889667, 0.12986953984289373, 3.935065230078552 ], [ 0.09154222364062455, 0.0024535700965608418, 0.1269634383806276, 3.936518280809685 ], [ 0.08959095045537396, 0.0023970161554559854, 0.12424863291808379, 3.9378756835409563 ], [ 0.08776266760011188, 0.0023440527494929895, 0.12170499563247501, 3.939147502183761 ], [ 0.08604496064783539, 0.002294316626737953, 0.11931524745059628, 3.9403423762747 ], [ 0.08442709711922641, 0.002247493808211682, 0.11706445044206512, 3.941467774778966 ], [ 0.08289975216958739, 0.0022033115239027336, 0.11493962594059517, 3.942530187029701 ], [ 0.08145477606798769, 0.0021615314314001625, 0.11292943095345713, 3.94353528452327 ], [ 0.08008501115577879, 0.00212194424646473, 0.11102390336730772, 3.944488048316345 ], [ 0.07878414162093438, 0.0020843653100807258, 0.10921425278141383, 3.945392873609292 ], [ 0.07754657120359752, 0.0020486310352684717, 0.10749269034200683, 3.9462536548289955 ] ]')
      });

      for (let i = 0; i < this.htmlConstants.length; i++) {
        this.addConstant();
      };

      this.reagents.forEach(element => {
        this.addInitialConcentration(element);
      });

    });
  };
  get initialConcentrations() {
    return this.form.get('config').get('calculationConfig').get('initialConcentrations') as FormArray;
  };

  addInitialConcentration(reagentName) {
    this.initialConcentrations.push(this.fb.group({
      [reagentName]: this.fb.control('')
    }));
  };

  get speedConstants() {
    return this.form.get('config').get('speedConstants') as FormArray;
  };

  addConstant() {
    this.speedConstants.push(this.fb.group({
      min: this.fb.control(''),
      max: this.fb.control(''),
      step: this.fb.control('')
    }));
  };

  onSubmit() {

    this.form.value.config.calculationConfig.timeInterval =
      [this.form.value.config.calculationConfig.timeInterval.start,
      this.form.value.config.calculationConfig.timeInterval.finish];
    this.form.value.equationData = this.equationData;
    this.form.value.equationData.forEach(e => {
      delete e.html;
    });

    let collector = {}
    this.form.value.config.calculationConfig.initialConcentrations.forEach(concentrationObj => {
      collector = { ...collector, ...concentrationObj };
    })
    this.form.value.config.calculationConfig.initialConcentrations = collector;


    this.httpCLient.calculateConstants(this.form.value).subscribe(summary => {
      //TODO handle error
      this.data.setSummary(summary);
      this.router.navigateByUrl('/summary');
    }
    );
  };
}
