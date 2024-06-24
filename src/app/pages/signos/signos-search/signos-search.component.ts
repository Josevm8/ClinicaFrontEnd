import { Component, OnInit, ViewChild } from '@angular/core';
import { SignosService } from '../../../services/signos.service';
import { Signos } from '../../../model/signos';
import { MatTableDataSource } from '@angular/material/table';
import { MaterialModule } from '../../../material/material.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { switchMap } from 'rxjs';
import { RouterLink, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-signos-search',
  standalone: true,
  imports: [MaterialModule, RouterLink, RouterOutlet],
  templateUrl: './signos-search.component.html',
  styleUrl: './signos-search.component.css'
})
export class SignosSearchComponent implements OnInit{

  dataSource: MatTableDataSource<Signos>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  columnDefinitions = [
    { def: 'idSigno', label: 'idSigno', hide: true},
    { def: 'patient', label: 'patient', hide: false}, 
    { def: 'fecha', label: 'fecha', hide: false},
    { def: 'temperatura', label: 'temperatura', hide: false},  
    { def: 'pulso', label: 'pulso', hide: false},
    { def: 'ritmo', label: 'ritmo', hide: false}, 
    { def: 'actions', label: 'actions', hide: false}
  ]

  constructor(
    private signosService: SignosService
    //private _snackBar: MatSnackBar
  ){}

  ngOnInit(): void {

    this.signosService.findAll().subscribe(data => this.createTable(data));

    this.signosService.getSignosChange().subscribe(data => this.createTable(data));

    //this.medicService.getMessageChange().subscribe(data => this._snackBar.open(data, 'INFO', {duration: 2000}));
    
}

createTable(data: Signos[]) {
  this.dataSource = new MatTableDataSource(data);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}

applyFilter(e: any){
  console.log(e);
  this.dataSource.filter = e.target.value.trim();    
}

getDisplayedColumns():string[] {
  return this.columnDefinitions.filter(cd=>!cd.hide).map(cd=>cd.def);
}

delete(idSigno: number){
  this.signosService.delete(idSigno)
  .pipe(switchMap( ()=> this.signosService.findAll() ))
  .subscribe(data => {
    this.signosService.setSignosChange(data);
    this.signosService.setMessageChange('DELETED!');
  })
}



}
