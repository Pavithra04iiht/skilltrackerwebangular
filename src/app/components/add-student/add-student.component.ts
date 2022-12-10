import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { EngineerService } from './../../shared/engineer.services';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  sengineerForm: FormGroup;
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
    private studentApi: ApiService

  ) {}

  initializeForm(){
    this.currentUser=;
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

  validateSkil(e,i){
    
  }

  /* Reactive book form */
  submitBookForm() {
    this.studentForm = this.fb.group({
      student_name: ['', [Validators.required]],
      student_email: ['', [Validators.required]],
      section: ['', [Validators.required]],
      subjects: [this.subjectArray],
      dob: ['', [Validators.required]],
      gender: ['Male'],
    });
  }

  /* Add dynamic languages */
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add language
    if ((value || '').trim() && this.subjectArray.length < 5) {
      this.subjectArray.push({ name: value.trim() });
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  /* Remove dynamic languages */
  remove(subject: Subject): void {
    const index = this.subjectArray.indexOf(subject);
    if (index >= 0) {
      this.subjectArray.splice(index, 1);
    }
  }

  /* Date */
  formatDate(e) {
    var convertDate = new Date(e.target.value).toISOString().substring(0, 10);
    this.studentForm.get('dob').setValue(convertDate, {
      onlyself: true,
    });
  }

  /* Get errors */
  public handleError = (controlName: string, errorName: string) => {
    return this.studentForm.controls[controlName].hasError(errorName);
  };

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
