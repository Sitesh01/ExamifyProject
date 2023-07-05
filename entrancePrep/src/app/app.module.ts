import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule, MatAccordion } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';


import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';

import { AppComponent } from './app.component';
import { BlogComponent } from './components/common/blog/blog.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { LandingpageComponent } from './components/common/landingpage/landingpage.component';
import { SignupComponent } from './components/authentication/signup/signup.component';
import { LoginComponent } from './components/authentication/login/login.component';
import { ForgetPasswordComponent } from './components/authentication/forget-password/forget-password.component';
import { NavbarComponent } from './components/common/navbar/navbar.component';
import { FooterComponent } from './components/common/footer/footer.component';
import { BlogPageComponent } from './components/user/blog-page/blog-page.component';
import { AddQuestionComponent } from './components/admin/add-question/add-question.component';
import { QuestionModulesComponent } from './components/user/question-modules/question-modules.component';
import { QuestionSetsComponent } from './components/user/question-sets/question-sets.component';
import { TestScreenComponent } from './components/user/test-screen/test-screen.component';
import { EditBlogDialogComponent } from './components/admin/add-edit-blog-dialog/edit-blog-dialog.component';
import { VerifyDialogComponent } from './components/common/utilities/verify-dialog/verify-dialog.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { LoaderInterceptor } from './interceptors/loader-interceptor.service';
import { LoaderComponent } from './components/common/utilities/loader/loader.component';
import { ProfileComponent } from './components/authentication/profile/profile.component';
import { UserDashboardComponent } from './components/user/user-dashboard/user-dashboard.component';
import { TestInstructionComponent } from './components/user/test-instruction/test-instruction.component';
import { UsersComponent } from './components/admin/users/users.component';
import { CommentsComponent } from './components/admin/comments/comments.component';
import { FeedbacksComponent } from './components/admin/feedbacks/feedbacks.component';
import { UserEditDialogComponent } from './components/admin/user-add-edit-dialog/user-edit-dialog.component';
import { SidebarComponent } from './components/admin/sidebar/sidebar.component';
import { DashboardDetailsComponent } from './components/admin/dashboard-details/dashboard-details.component';
import { SettingComponent } from './components/authentication/setting/setting.component';
import { FeedbackBoxComponent } from './components/user/feedback-box/feedback-box.component';
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
import { SeeSubmittedAnswersComponent } from './components/user/see-submitted-answers/see-submitted-answers.component';
import { PrivacyComponent } from './components/authentication/privacy/privacy.component';
import { NotificationComponent } from './components/authentication/notification/notification.component';
import { HelpComponent } from './components/authentication/help/help.component';

@NgModule({
  declarations: [
    AppComponent,
    BlogComponent,
    DashboardComponent,
    LandingpageComponent,
    SignupComponent,
    LoginComponent,
    ForgetPasswordComponent,
    NavbarComponent,
    FooterComponent,
    BlogPageComponent,
    AddQuestionComponent,
    QuestionModulesComponent,
    QuestionSetsComponent,
    TestScreenComponent,
    EditBlogDialogComponent,
    VerifyDialogComponent,
    LoaderComponent,
    ProfileComponent,
    UserDashboardComponent,
    TestInstructionComponent,
    UsersComponent,
    CommentsComponent,
    FeedbacksComponent,
    UserEditDialogComponent,
    SidebarComponent,
    DashboardDetailsComponent,
    SettingComponent,
    FeedbackBoxComponent,
    AdminQuestionModulesComponent,
    AdminQuestionsListComponent,
    ExaminesComponent,
    ResetPasswordComponent,
    ExaminesSubmissionDetailsComponent,
    AboutComponent,
    ContactComponent,
    FaqComponent,
    PoliciesComponent,
    SelectionProcessComponent,
    SeeSubmittedAnswersComponent,
    PrivacyComponent,
    NotificationComponent,
    HelpComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    MatCardModule,
    HttpClientModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatButtonModule,
    MatRadioModule,
    MatDialogModule,
    FontAwesomeModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatChipsModule,
    MatTabsModule,
    MdbCheckboxModule,
    MdbTabsModule,
    MdbCollapseModule,
    CKEditorModule,
    MatDividerModule,
    MatMenuModule,
    MatExpansionModule,
    MatListModule,
    MatCheckboxModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
