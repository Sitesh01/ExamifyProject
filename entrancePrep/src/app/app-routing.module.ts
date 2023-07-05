import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { BlogComponent } from './components/common/blog/blog.component';
import { LandingpageComponent } from './components/common/landingpage/landingpage.component';
import { SignupComponent } from './components/authentication/signup/signup.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { ForgetPasswordComponent } from './components/authentication/forget-password/forget-password.component';
import { AuthGuard } from './helpers/auth.guard';
import { AddQuestionComponent } from './components/admin/add-question/add-question.component';
import { QuestionModulesComponent } from './components/user/question-modules/question-modules.component';
import { TestScreenComponent } from './components/user/test-screen/test-screen.component';
import { BlogPageComponent } from './components/user/blog-page/blog-page.component';
import { UserDashboardComponent } from './components/user/user-dashboard/user-dashboard.component';
import { TestInstructionComponent } from './components/user/test-instruction/test-instruction.component';
import { UsersComponent } from './components/admin/users/users.component';
import { CommentsComponent } from './components/admin/comments/comments.component';
import { FeedbacksComponent } from './components/admin/feedbacks/feedbacks.component';
import { DashboardDetailsComponent } from './components/admin/dashboard-details/dashboard-details.component';
import { SettingComponent } from './components/authentication/setting/setting.component';
import { AdminQuestionModulesComponent } from './components/admin/admin-question-modules/admin-question-modules.component';
import { AdminQuestionsListComponent } from './components/admin/admin-questions-list/admin-questions-list.component';
import { ExaminesComponent } from './components/admin/examines/examines.component';
import { ResetPasswordComponent } from './components/authentication/reset-password/reset-password.component';
import { ExaminesSubmissionDetailsComponent } from './components/admin/examines-submission-details/examines-submission-details.component';
import { AboutComponent } from './components/common/about/about.component';
import { ContactComponent } from './components/common/contact/contact.component';
import { FaqComponent } from './components/common/faq/faq.component';
import { PoliciesComponent } from './components/common/policies/policies.component';
import { SelectionProcessComponent } from './components/common/selection-process/selection-process.component';
import { QuestionSetsComponent } from './components/user/question-sets/question-sets.component';
import { SeeSubmittedAnswersComponent } from './components/user/see-submitted-answers/see-submitted-answers.component';

const routes: Routes = [
  { path: '', component: LandingpageComponent },
  { path: 'blogs', component: BlogComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgetPassword', component: ForgetPasswordComponent },
  { path: 'about', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'policies', component: PoliciesComponent },
  { path: 'selection-process', component: SelectionProcessComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard-details', pathMatch: 'full' },
      { path: 'dashboard-details', component: DashboardDetailsComponent },
      { path: 'users', component: UsersComponent },
      { path: 'examines', component: ExaminesComponent },
      { path: 'blogs', component: BlogComponent },
      { path: 'admin-question-modules', component: AdminQuestionModulesComponent },
      { path: 'comments', component: CommentsComponent },
      { path: 'feedbacks', component: FeedbacksComponent },
    ],
  },
  {
    path: 'dashboard-details',
    component: DashboardDetailsComponent,
    canActivate: [AuthGuard],
  },
  { path: 'blogs/:id', component: BlogPageComponent },
  //add-edit question component
  {
    path: 'question/:set/:subject',
    component: AddQuestionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'question/:set/:subject/:status/:id',
    component: AddQuestionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'question-sets',
    component: QuestionModulesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'questions/subject/:subject',
    component: QuestionSetsComponent,
    canActivate: [AuthGuard],
  },
  //------------------------------------------------
  {
    path: 'test/:subject/:id',
    component: TestScreenComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'submittedAnswers/:subject/:id',
    component: SeeSubmittedAnswersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'test-instruction/:subject/:id',
    component: TestInstructionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'question-modules',
    component: QuestionModulesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'questionsList/:subject',
    component: AdminQuestionsListComponent,
    canActivate: [AuthGuard],
  },
  //------------------------------------------------
  { path: 'setting', component: SettingComponent, canActivate: [AuthGuard] },
  {
    path: 'user-dashboard',
    component: UserDashboardComponent,
    canActivate: [AuthGuard],
  },

  {
    path: 'examines',
    component: ExaminesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'resetPassword/:token',
    component: ResetPasswordComponent,
  },
  {
    path: 'examineDetails/:testId',
    component: ExaminesSubmissionDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
