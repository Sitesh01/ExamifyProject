import { Component } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent {
  panelOpenState = false;

  faqs = [
    {
      question: 'How do I sign up for an account on your website?',
      answer:
        "To sign up for an account, simply click on the 'Sign Up' button on the homepage of our website and fill in the required information. Once you submit the information, you will receive a verification email to confirm your account.",
    },
    {
      question: 'How can I access the test modules on your website?',
      answer:
        'After logging in to your account, you can access the test modules by selecting the exam you want to prepare for and clicking on the corresponding test module. You can then start practicing and preparing for the exam.',
    },
    {
      question: 'Can I track my progress on your website?',
      answer:
        'Yes, you can track your progress by accessing the dashboard on your account. The dashboard will display your performance in each test module and allow you to monitor your progress over time.',
    },
    {
      question: 'What kind of information can I include in my profile?',
      answer:
        'You can include personal information such as your name, email address, and academic history. You can also upload your test results to your profile to track your progress over time.',
    },
    {
      question: 'Are there any fees for using your website?',
      answer:
        'We offer both free and paid subscription plans on our website. The free plan includes limited access to test modules and resources, while the paid plan offers full access to all our resources and features.',
    },
    {
      question: 'Can I access your website on my mobile device?',
      answer:
        'Yes, our website is mobile-friendly and can be accessed on any device with an internet connection.',
    },
    {
      question:
        'What types of entrance exams do you offer preparation resources for?',
      answer:
        'We offer preparation resources for a range of entrance exams, including medical, engineering, law, and more. You can browse our website to see the full list of exams we cover.',
    },
    {
      question: 'How often are new test modules added to your website?',
      answer:
        'We regularly update our website with new test modules and resources to ensure that our users have access to the most up-to-date preparation materials.',
    },
    {
      question:
        'How can I get in touch with customer support if I have a question or issue?',
      answer:
        "You can contact our customer support team through the 'Contact Us' page on our website. We will respond to your query as soon as possible.",
    },
    {
      question: 'Can I share my account with other users?',
      answer:
        'No, sharing your account with other users is not allowed. Each account is for individual use only, and any sharing of accounts will result in suspension or termination of your account.',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
