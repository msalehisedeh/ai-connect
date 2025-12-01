import { Component } from '@angular/core';
import { RagService } from '../services/rag-service';

@Component({
  selector: 'app-rag',
  templateUrl: './rag-component.html',
  styleUrls: ['./rag-component.scss']
})
export class RagComponent {

  question = '';
  answer = '';
  loading = false;

  constructor(private ragService: RagService) {}

  ask() {
    this.loading = true;
    this.answer = '';

    this.ragService.queryRag(this.question).subscribe({
      next: (res) => {
        this.answer = res.answer;
        this.loading = false;
      },
      error: (err) => {
        this.answer = 'Error contacting RAG backend';
        this.loading = false;
      }
    });
  }
}
