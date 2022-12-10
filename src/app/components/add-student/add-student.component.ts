import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { EngineerService } from 'src/app/shared/engineer.service'; 
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import technicalSkills from "src/app/data/tech-skills.json";
import nonTechnicalSkills from "src/app/data/nontech-skills.json";

import { AuthenticationService } from 'src/app/shared/authentication.service';

export interface Subject {
  name: string;
}

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html',
  styleUrls: ['./add-student.component.css'],
})
export class AddStudentComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  @ViewChild("chipList",{static:true}) chipList;
  @ViewChild("resetForm",{static:true}) myNgForm;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  engineerForm: FormGroup;
  ts: any =technicalSkills;
  nts: any =nonTechnicalSkills;
  HasError=false;
  ErrorMessage="";
  maxScore=20;
  currentUser:any;
  
 

  ngOnInit() {
    this.initializeForm();
  }

  constructor(
    public fb: FormBuilder,
    private router: Router,
    private ngZone: NgZone,
    private engineerApi: EngineerService,
    private authenticationService: AuthenticationService

  ) {}

  initializeForm(){
    this.currentUser=this.authenticationService.getLoggedInUser();
    this.engineerForm=this.fb.group({
      id:[
        this.currentUser.username,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(30),
        ],
      ],
      name:[
        "",
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(30),
        ],
      ],
      email:[
        this.currentUser.email,
        [
          Validators.required,
          Validators.email,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"),
        ],
      ],
      mobileNo:[
        "",
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      technicalSkills:[this.ts],
      nonTechnicalSkills:[this.nts],
    });
  }

  validateSkill(e,i){
    const maxExpertiseLevel=20;
    let expertiseLevel=parseInt(e.target.value);
    if(Number.isInteger(expertiseLevel)){
      if(expertiseLevel<0)e.target.value=0;
      if(expertiseLevel>maxExpertiseLevel)e.target.value=maxExpertiseLevel;
    }else{
      e.target.value=0;
    }
  }

  onTechnicalSkillChange($event,index){
    let value=$event.target.value;
    this.ts[index].expertiseLevel=value>this.maxScore?this.maxScore:value;


  }

  onNonTechnicalSkillChange($event,index){
    let value=$event.target.value;
    this.nts[index].expertiseLevel=value>this.maxScore?this.maxScore:value;

  }

  /* error */
  public handleError=(controlName:string,errorName:string)=>{
    return this.engineerForm.controls[controlName].hasError(errorName);
  };

  updateScoreIfEmpty(skillSets:Array<any>):any[]{
    let updateScore=skillSets.map((s)=>{
      if(s.expertiseLevel=="")s.expertiseLevel=0;
      return s;
    });

    return updateScore;

  }

    


  /* Submit book */
  submitEngineerForm() {
    this.HasError=false;
    console.log(this.engineerForm.value);
    if (this.engineerForm.valid) {
      this.engineerForm.value.technicalSkills=this.updateScoreIfEmpty(
        this.engineerForm.value.technicalSkills
      );
      this.engineerForm.value.nonTechnicalSkills=this.updateScoreIfEmpty(
        this.engineerForm.value.nonTechnicalSkills
      );
      this.engineerApi.Add(this.engineerForm.value).subscribe((res) => {
        let path=this.currentUser.isAdmin?"/admin":"/dashboard";
        this.ngZone.run(() => this.router.navigateByUrl(path));
      },
      (error)=>{
        this.HasError=true;
        this.ErrorMessage=error;
      }
      );
    }
  }
}
