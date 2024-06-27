import { SignosService } from './../../../services/signos.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../../material/material.module';
import { Signos } from '../../../model/signos';
import { Patient } from '../../../model/patient';
import { format } from 'date-fns';

@Component({
  selector: 'app-signos-edit',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signos-edit.component.html',
  styleUrl: './signos-edit.component.css'
})
export class SignosEditComponent implements OnInit {

  form: FormGroup;
  id: number;
  isEdit: boolean;
 // minDate: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private signosService: SignosService
  ) { }

  //private route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.form = new FormGroup({
      idSigno: new FormControl(0),
      idPatient: new FormControl(0),
      nombres: new FormControl(''),
      apellidos: new FormControl(''),
      fecha: new FormControl(''),
      temperatura: new FormControl(''),
      pulso: new FormControl(''),
      ritmo: new FormControl(''),
      

    });

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });

     
    //this.form.controls['apellidos'].disable();
  
  }

  initForm() {

    if (this.isEdit) {
      this.signosService.findById(this.id).subscribe(data => {
        this.form = new FormGroup({
          idSigno: new FormControl(data.idSigno),
          idPatient: new FormControl(data.patient.idPatient),
          nombres: new FormControl( {value: data.patient.firstName, disabled: true} ),
          apellidos: new FormControl( {value: data.patient.lastName, disabled: true} ),
          fecha: new FormControl( data.fecha ),
          temperatura: new FormControl(data.temperatura),
          pulso: new FormControl(data.pulso),
          ritmo: new FormControl(data.ritmo),

        });
      });
      console.log(this.form.value['idPatient'])
    }
    
  }

  operate() {
    console.log("operate")
    const signos: Signos = new Signos();
    signos.idSigno = this.form.value['idSigno'];
    signos.temperatura = this.form.value['temperatura'];
    signos.pulso = this.form.value['pulso'];
    signos.ritmo = this.form.value['ritmo'];
    signos.fecha = this.form.value['fecha'];
    //signos.fecha = format(this.form.value['fecha'], "yyyy-MM-dd'T'HH:mm:ss");  

    const pacientes = new Patient();
    pacientes.idPatient = this.form.value['idPatient'];
    pacientes.firstName = this.form.value['nombres'];
    pacientes.lastName = this.form.value['apellidos'];
    signos.patient = pacientes;


    console.log(signos)
    if (this.isEdit) {
      //UPDATE
      //PRACTICA COMUN - NO IDEAL
      console.log(signos)
      this.signosService.update(this.id, signos).subscribe(() => {
        this.signosService.findAll().subscribe(data => {
          this.signosService.setSignosChange(data);
          this.signosService.setMessageChange('UPDATED!');
        });
      });
    }

    this.router.navigate(['/pages/signos-search']);

  }


}
