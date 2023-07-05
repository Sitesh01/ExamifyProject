import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ActivatedRoute } from '@angular/router';
import { QuestionService } from 'src/app/services/question.service';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.scss'],
})
export class AddQuestionComponent {
  public Editor: any = ClassicEditor;
  public Editor2: any = ClassicEditor;

  question: string = '';
  opt: string = '';
  sets: Number = 0;

  questionForm!: FormGroup;
  ques_id: any;
  status: any;

  title: string = 'Add';
  btnAction: string = 'Create';

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private _snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private questionApiService: QuestionService
  ) {}

  ngOnInit(): void {
    this.questionForm = this.formBuilder.group({
      question: ['', Validators.required],
      subject: ['', Validators.required],
      setNo: ['', Validators.required],
      options: this.formBuilder.array([]),
      correctAnswer: ['', Validators.required],
      explanation: ['', Validators.required],
      activatedDate: ['', Validators.required],
      author: ['', Validators.required],
    });

    this.ques_id = this.route.snapshot.paramMap.get('id');
    this.status = this.route.snapshot.paramMap.get('status');

    if (this.status != 'editQuestion') {
      this.route.params.subscribe((params) => {
        this.questionForm.patchValue({
          // setNo: params['set'],
          subject: params['subject'],
        });
      });
    }

    if (this.status == 'editQuestion') {
      this.title = 'Edit';
      this.btnAction = 'Update';
      this.getQuestionById();
    }
  }

  options(): FormArray {
    return this.questionForm.get('options') as FormArray;
  }

  newOption(): FormGroup {
    return this.formBuilder.group({
      opt: ['', Validators.required],
    });
  }

  addOption(): void {
    this.options().push(this.newOption());
  }

  removeOption(index: number): void {
    this.options().removeAt(index);
  }

  operation() {
    if (this.status == 'editQuestion') {
      this.updateQuestion();
    } else {
      this.createQuestion();
    }
  }

  updateQuestion() {
    let options = this.questionForm.value.options;
    const values = options.map((option: { opt: any }) => option.opt);
    this.questionForm.value.options = values;
    console.log('------Updating-----------', this.questionForm.value);
    this.questionApiService
      .updateQuestion(this.questionForm.value, this.ques_id)
      .subscribe({
        next: (data) => {
          this._snackBar.open('Question updated successfully', 'Close', {
            duration: 2000,
            panelClass: ['success-snackbar'],
            verticalPosition: 'top',
          });
          this.apiService.loader.next(false);
        },
        error: (error) => {
          this._snackBar.open(`🚨 ${error.error.message}`, 'Close', {
            duration: 2000,
            panelClass: ['error-snackbar'],
            verticalPosition: 'top',
          });
          this.apiService.loader.next(false);
        },
      });
  }

  createQuestion() {
    console.log('question values: ', this.questionForm.value);
    let options = this.questionForm.value.options;
    const values = options.map((option: { opt: any }) => option.opt);
    this.questionForm.value.options = values;
    console.log('------Editing-----------', this.questionForm.value);
    this.questionApiService.addQuestion(this.questionForm.value).subscribe({
      next: (data) => {
        this._snackBar.open('Question added successfully', 'Close', {
          duration: 2000,
          panelClass: ['success-snackbar'],
          verticalPosition: 'top',
        });
        this.apiService.loader.next(false);
      },
      error: (error) => {
        this._snackBar.open(`🚨 ${error.error.message}`, 'Close', {
          duration: 2000,
          panelClass: ['error-snackbar'],
          verticalPosition: 'top',
        });
        this.apiService.loader.next(false);
      },
    });
  }
  //for editing purpose
  getQuestionById() {
    this.questionApiService.getQuestionById(this.ques_id).subscribe({
      next: (data) => {
        data = data.data.question;
        console.log('question data: ', data);
        //remove :ss from activated date
        let acDate = data.activatedDate.split(':');
        acDate.pop();
        acDate = acDate.join(':');
        console.log('acDate: ', acDate);
        this.questionForm.patchValue({
          question: data.question,
          subject: data.subject,
          setNo: data.setNo,
          correctAnswer: data.correctAnswer,
          explanation: data.explanation,
          activatedDate: acDate,
          author: data.author,
        });

        // fetch options and add to form array and patch each option value to form array
        let options = data.options;
        options.forEach((option: any, index: number) => {
          this.addOption();
          this.options().at(index).patchValue({
            opt: option,
          });
        });
        this.apiService.loader.next(false);
      },
      error: (error) => {
        this._snackBar.open(`🚨 ${error.error.message}`, 'Close', {
          duration: 2000,
          panelClass: ['error-snackbar'],
          verticalPosition: 'top',
        });
        this.apiService.loader.next(false);
      },
    });
  }
}
