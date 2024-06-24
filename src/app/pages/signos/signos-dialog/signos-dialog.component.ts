import { SignosService } from './../../../services/signos.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PatientService } from '../../../services/patient.service';
import { Patient } from './../../../model/patient';
import { Component, Inject, OnInit } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { FormsModule } from '@angular/forms';
import { switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signos-dialog',
  standalone: true,
  imports: [MaterialModule, FormsModule],
  templateUrl: './signos-dialog.component.html',
  styleUrl: './signos-dialog.component.css'
})
export class SignosDialogComponent implements OnInit {
  patient: Patient;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Patient,
    private _dialogRef: MatDialogRef<SignosDialogComponent>,
    private patientService: PatientService,
    private signosService: SignosService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.patient = { ...this.data }; //spread operator
    this.signosService.getMessageChange().subscribe(data => this._snackBar.open(data, 'CREATED!', {duration: 2000}));
  }

  close() {
    this._dialogRef.close();
  }

  operate() {
    console.log(this.patient)
    //INSERT
    this.patientService
      .save(this.patient)//.subscribe(data => console.log('rspta '+data));
      .pipe(switchMap(() => this.signosService.findAll()))
      .subscribe((data) => {
        //this.patientService.setPatientChange(data);
        this.signosService.setSignosChange(data);
        this.signosService.setMessageChange('CREATED!');
      });
  
      this.close();
    }
}
