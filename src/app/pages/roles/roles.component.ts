import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment.development';
import { MaterialModule } from '../../material/material.module';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent implements OnInit{

  username: string;
  roles: string;

  //constructor(private menuService: MenuService){


  ngOnInit(): void {
      const helper = new JwtHelperService();
      const token = sessionStorage.getItem(environment.TOKEN_NAME);
      const decodedToken = helper.decodeToken(token);

      this.username = decodedToken.sub;

      this.roles = decodedToken.role;

      //console.log(decodedToken);

      //this.menuService.getMenusByUser(this.username).subscribe(data => this.menuService.setMenuChange(data));
  }

}
