import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']  // Cambiado styleUrl a styleUrls
})

export class GameComponent {
  cards: any[] = [];
  flippedCards: any[] = [];
  matchedPairs = 0;
  attempts = 0;
  score = 0;
  timer: any;
  timeElapsed = 0;

  ngOnInit() {
    this.initGame(6); // Número inicial de pares
  }

  initGame(numPairs: number) {
    const symbols = this.generateSymbols(numPairs);
    this.cards = this.shuffle([...symbols, ...symbols]).map(symbol => ({ symbol, flipped: false }));
    this.startTimer();
  }

  generateSymbols(numPairs: number): string[] {
    const symbols = ['🍎', '🍌', '🍇', '🍓', '🍒', '🍍', '🍑', '🍋'];
    return symbols.slice(0, numPairs);
  }

  shuffle(array: any[]): any[] {
    return array.sort(() => Math.random() - 0.5);
  }

  flipCard(card: any) {
    if (this.flippedCards.length < 2 && !card.flipped) {
      card.flipped = true;
      this.flippedCards.push(card);

      if (this.flippedCards.length === 2) {
        this.checkMatch();
      }
    }
  }

  checkMatch() {
    this.attempts++;
    const [card1, card2] = this.flippedCards;
    if (card1.symbol === card2.symbol) {
      this.matchedPairs++;
      this.score += 100;
      this.flippedCards = [];
      if (this.matchedPairs === this.cards.length / 2) {
        clearInterval(this.timer);
        alert(`¡Juego terminado! Puntaje: ${this.score}. Tiempo: ${this.timeElapsed}s`);
      }
    } else {
      setTimeout(() => {
        card1.flipped = false;
        card2.flipped = false;
        this.flippedCards = [];
      }, 1000);
    }
  }

  startTimer() {
    this.timeElapsed = 0;
    this.timer = setInterval(() => {
      this.timeElapsed++;
    }, 1000);
  }

  resetGame(numPairs: number) {
    clearInterval(this.timer);
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.attempts = 0;
    this.score = 0;
    this.initGame(numPairs);
  }
}
