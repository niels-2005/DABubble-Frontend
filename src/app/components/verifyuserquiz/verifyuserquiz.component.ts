import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from 'src/app/services/localstorage.service';
import { LogoutService } from 'src/app/services/logout.service';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-verifyuserquiz',
  templateUrl: './verifyuserquiz.component.html',
  styleUrls: ['./verifyuserquiz.component.scss']
})
export class VerifyuserquizComponent implements OnInit {

  token = localStorage.getItem('token');

  userFullName = "";

  currentQuestionTitle!: string;
  answers!: string[];
  answerHints!: string;
  quizAttempts!: number;

  currentQuestion = 1;

  selectedAnswerIndex: number | null = null;

  constructor(private localStorageService: LocalstorageService, private logoutService: LogoutService, private router: Router, private messageService: MessageService) {}

  ngOnInit(): void {
    let items = this.localStorageService.getItemsFromLocalStorage();
    this.userFullName = items.full_name || "";
  }

  startQuiz(){
    document.getElementById('welcome-quiz-message')?.classList.add('d-none');
    document.getElementById('question-container')?.classList.remove('d-none');
    this.getQuestionsFromBackend();
  }

  async getQuestionsFromBackend(){
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${this.token}`);

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
    };

    // const response = await fetch(`https://celinemueller.pythonanywhere.com/quiz/answers/${this.currentQuestion}/`, requestOptions);
    const response = await fetch(`http://127.0.0.1:8000/quiz/answers/${this.currentQuestion}/`, requestOptions);

    if (response.ok) {
        const result = await response.json();
        console.log(result);
        this.checkIfUserVerifiedQuiz(result);
        this.checkQuizAttemptStatus(result);
        this.renderQuestionsAndAnswers(result);
    } else {
        console.log('Error: ', response.status);
    }
  }

  checkIfUserVerifiedQuiz(result: any){
    if(result.quiz_verified === 'true'){
      this.router.navigateByUrl('/complete-your-profile');
    }
  }

  checkQuizAttemptStatus(result: any){
    if(result.quiz_attempts === 0){
      this.logoutService.logoutUser();
      this.localStorageService.removeItemsFromLocalStorage();
      localStorage.setItem('is_locked', 'true');
      this.router.navigateByUrl('/login');
    }
  }

  renderQuestionsAndAnswers(result: any){
    this.currentQuestionTitle = result.question;
    this.answers = result.answers;
    this.quizAttempts = result.quiz_attempts;
    this.answerHints = result.hint;
  }

  selectAnswer(index: number) {
    let radios: any = document.getElementsByName('answer');
    radios[index].checked = true;
    this.selectedAnswerIndex = index;
  }

  async sendAnswer(){

    if (this.selectedAnswerIndex === null) {
      console.error('Keine Antwort ausgewählt');
      return;
  }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Token ${this.token}`);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "given_answer": this.selectedAnswerIndex.toString()
    });

    const requestOptions : RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
};

    // const response = await fetch(`https://celinemueller.pythonanywhere.com/quiz/check-answer/${this.currentQuestion}/`, requestOptions)
    const response = await fetch(`http://127.0.0.1:8000/quiz/check-answer/${this.currentQuestion}/`, requestOptions)
    if (response.ok) {
      const result = await response.json();
      console.log(result);
      this.checkAnswer(result);
    } else {
      console.log('Error: ', response.status);
  }
      this.selectedAnswerIndex = null;
  }

  checkAnswer(result: any){
    if(result.success){
      this.currentQuestion++;
      this.showGreenShadowIfCorrectAnswer();
      this.getQuestionsFromBackend();
    } else {
      this.showRedShadowIfWrongAnswer();
      this.getQuestionsFromBackend();
    }
  }

  showGreenShadowIfCorrectAnswer(){
    document.getElementById('quiz-content-container')?.classList.add('success-border');
      setTimeout(() => {
        document.getElementById('quiz-content-container')?.classList.remove('success-border');
      }, 1000);
  }

  showRedShadowIfWrongAnswer(){
    document.getElementById('quiz-content-container')?.classList.add('failed-border');
      setTimeout(() => {
        document.getElementById('quiz-content-container')?.classList.remove('failed-border');
      }, 1000);
  }

}
