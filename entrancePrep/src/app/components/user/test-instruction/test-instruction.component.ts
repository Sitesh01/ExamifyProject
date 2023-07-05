import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-test-instruction',
  templateUrl: './test-instruction.component.html',
  styleUrls: ['./test-instruction.component.scss'],
})
export class TestInstructionComponent {
  set: any = '';
  setNo: any = '';
  subject: any = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.setNo = params.get('id');
      this.subject = params.get('subject');
    });
  }

  startQuiz() {
    this.router.navigate([`/test/${this.subject}/${this.setNo}`]);
  }
}
