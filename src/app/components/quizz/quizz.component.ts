import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import quizz_questions from "../../../assets/data/quizz_questions.json"; // Corrigido nome do arquivo

@Component({
  selector: 'app-quizz',
  templateUrl: './quizz.component.html',
  styleUrls: ['./quizz.component.css'],
  standalone: true,
  imports: [CommonModule], // Necessário para usar *ngIf
})
export class QuizzComponent implements OnInit {

  title: string = "";

  questions: any[] = []; // Inicializado como array vazio para evitar erros
  questionSelected: any = null; // Inicializado como null para melhor controle

  answers: string[] = [];
  answerSelected: string = "";

  questionIndex: number = 0;
  questionMaxIndex: number = 0;

  finished: boolean = false;

  constructor() {}

  ngOnInit(): void {
    if (quizz_questions) {
      this.finished = false;
      this.title = quizz_questions.title;

      this.questions = quizz_questions.questions;
      this.questionMaxIndex = this.questions.length;

      if (this.questions.length > 0) {
        this.questionSelected = this.questions[this.questionIndex];
      }
    }
  }
  

  playerChoose(value: string): void {
    this.answers.push(value);
    this.nextStep();
  }

  async nextStep(): Promise<void> {
    this.questionIndex++;

    if (this.questionIndex < this.questionMaxIndex) {
      this.questionSelected = this.questions[this.questionIndex];
    } else {
      const finalAnswer: string = await this.checkResult(this.answers);
      this.finished = true;
      this.answerSelected = quizz_questions.results[finalAnswer as keyof typeof quizz_questions.results];
    }
  }

  async checkResult(answers: string[]): Promise<string> {
    const result = answers.reduce((prev, curr, _, arr) =>
      arr.filter(item => item === prev).length > arr.filter(item => item === curr).length ? prev : curr
    );

    return result ;
  }
}
