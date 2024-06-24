import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../material/material.module';
import { SignosService } from '../../services/signos.service';
import { Signos } from '../../model/signos';
import { Observable, map, switchMap } from 'rxjs';
import { Patient } from '../../model/patient';
import { AsyncPipe } from '@angular/common';
import { PatientService } from '../../services/patient.service';
import { MatDialog } from '@angular/material/dialog';
import {SignosDialogComponent} from './signos-dialog/signos-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { format, formatISO } from 'date-fns';

@Component({
  selector: 'app-signos',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule, RouterLink, AsyncPipe],
  templateUrl: './signos.component.html',
  styleUrl: './signos.component.css'
})
export class SignosComponent implements OnInit {

  form: FormGroup;
  id: number;
  isEdit: boolean;
  patientsFiltered$: Observable<Patient[]>
  patients: Patient[];
  patControl: FormControl = new FormControl();
  minDate: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private signosService: SignosService,
    private patientService: PatientService,
    private formBuilder: FormBuilder,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      fecha: [new FormControl(new Date())],
      temperatura: new FormControl(''),
      pulso: new FormControl(''),
      ritmo: new FormControl(''),
      pat: this.patControl,
    });

    this.loadInitialData();

    this.patientsFiltered$ = this.patControl.valueChanges.pipe(map(val => this.filterExams(val)));

    //this.patientService.getPatientChange().subscribe(data => this.createTable(data));
    this.signosService.getMessageChange().subscribe(data => this._snackBar.open(data, 'CREATED!', {duration: 2000}));
  }

  loadInitialData() {
    this.patientService.findAll().subscribe(data => this.patients = data);
  }

  getDate(e: any){
    console.log(e.value);
  }

  showExam(val: any) {
    return val ? `${val.firstName} ${val.lastName}` : val;
  }

  filterExams(val: any) {
    if (val?.idPatient > 0) {
      return this.patients.filter(el =>
        el.firstName.toLowerCase().includes(val.firstName.toLowerCase()) || el.lastName.toLowerCase().includes(val.lastName.toLowerCase())
      )
    } else {
      return this.patients.filter(el =>
        el.firstName.toLowerCase().includes(val?.toLowerCase()) || el.lastName.toLowerCase().includes(val?.toLowerCase())
      )
    }
  }

  openDialog(){
    const signos = new Signos();
    this._dialog.open(SignosDialogComponent, {
      width: '350px',
      data: signos.patient = this.form.value['pat'],
      disableClose: false
    });
  }

  clear(){
    this.form = this.formBuilder.group({
      pat: new FormControl(''),
      fecha: [new FormControl(new Date())],
      temperatura: new FormControl(''),
      pulso: new FormControl(''),
      ritmo: new FormControl(''),
    });

  }

  save() {
    const signos = new Signos();
  
    signos.patient = this.form.value['pat'];
    console.log(signos.patient)

    signos.fecha = format(this.form.value['fecha'], "yyyy-MM-dd'T'HH:mm:ss");  
    signos.temperatura = this.form.value['temperatura'];
    signos.pulso = this.form.value['pulso'];
    signos.ritmo = this.form.value['ritmo'];
    
    //console.log({signos})

     this.signosService.save(signos).subscribe(data => console.log('rspta '+data));
     this.signosService.setMessageChange('CREATED!');

    //this.router.navigate(['/pages/patient']);
  }

}
