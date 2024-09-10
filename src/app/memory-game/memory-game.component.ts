import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Card {
  image: string;
  flipped: boolean;
  matched: boolean;
}

@Component({
  selector: 'app-memory-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './memory-game.component.html',
  styleUrls: ['./memory-game.component.css']
})
export class MemoryGameComponent {
  cards: Card[] = [];
  flippedCards: Card[] = [];
  matchedCards: Card[] = [];
  totalPairs: number = 6;
  attempts: number = 0;
  score: number = 0;
  timer: any = null;
  timeTaken: number = 0;
  gameInProgress: boolean = false;
  isPaused: boolean = false;
  bonusTime: number = 60; // Tiempo en segundos para obtener el bono

  constructor() {
    this.initGame();
  }

  initGame() {
    this.cards = this.generateCards();
    this.shuffleCards();
    this.gameInProgress = false;
    this.flippedCards = [];
    this.matchedCards = [];
    this.attempts = 0;
    this.score = 0;
    this.isPaused = false;
    this.timeTaken = 0; // Reiniciar el temporizador
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null; // Asegúrate de limpiar el temporizador
    }
  }

  generateCards(): Card[] {
    const images = [
      '/img/carta1.png', '/img/carta2.png', '/img/carta3.png',
      '/img/carta4.png', '/img/carta5.png', '/img/carta6.png'
    ];
    let cards: Card[] = [];
    images.slice(0, this.totalPairs).forEach(image => {
      cards.push({ image, flipped: false, matched: false });
      cards.push({ image, flipped: false, matched: false });
    });
    return cards;
  }

  shuffleCards() {
    this.cards.sort(() => Math.random() - 0.5);
  }

  flipCard(card: Card) {
    if (this.gameInProgress && !card.flipped && !card.matched && this.flippedCards.length < 2) {
      card.flipped = true;  // Al hacer clic, la carta se voltea
      this.flippedCards.push(card);  // Guardamos las cartas volteadas temporalmente

      if (this.flippedCards.length === 2) {
        this.attempts++;
        this.checkForMatch();  // Si hay dos cartas volteadas, verificamos si coinciden
      }
    }
  }

  checkForMatch() {
    const [card1, card2] = this.flippedCards;
    if (card1.image === card2.image) {
      card1.matched = true;
      card2.matched = true;
      this.matchedCards.push(card1, card2);
      this.flippedCards = [];
      this.calculateScore();
      if (this.matchedCards.length === this.cards.length) {
        this.endGame();
      }
    } else {
      setTimeout(() => {
        card1.flipped = false;
        card2.flipped = false;
        this.flippedCards = [];
      }, 1000);
    }
  }

  calculateScore() {
    const basePoints = 10;
    this.score += basePoints;
  }

  calculateFinalScore() {
    const basePoints = 10;
    this.score += basePoints;
    
    // Calcula el bono si el tiempo es menor al tiempo objetivo
    if (this.timeTaken < this.bonusTime) {
      const bonusPoints = 50; // Puntos de bono
      this.score += bonusPoints;
    }
  }

  startGame() {
    this.gameInProgress = true;
    this.isPaused = false; // Asegúrate de que no esté en pausa al iniciar el juego
    if (!this.timer) {
      this.timer = setInterval(() => {
        if (!this.isPaused) {
          this.timeTaken++;
        }
      }, 1000);
    }
  }

  endGame() {
    clearInterval(this.timer);
    this.timer = null; // Asegúrate de limpiar el temporizador
    this.calculateFinalScore(); // Calcula el puntaje final incluyendo el bono
    const bonusMessage = this.timeTaken < this.bonusTime ? `¡Bono de ${50} puntos! por agilidad` : '';
    alert(`Juego terminado! Puntaje: ${this.score}, Tiempo: ${this.timeTaken} segundos. ${bonusMessage}`);
  }

  resetGame() {
    this.initGame(); // Reinicia el juego y el temporizador
  }

  togglePause() {
    this.isPaused = !this.isPaused;
  }
}
