import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  userInp: string = ''; // Bind user input
  result: any = null;
  url: string = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
  ingredients: string[] = [];
  title: any;

  constructor(private http: HttpClient) {}

  // Method to capture the input change
  onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.userInp = inputElement.value;
  }

  // Method to fetch meal data
  fetchMeal() {
    if (this.userInp.length === 0) {
      this.result = { error: 'Input Field Cannot be Empty' };
      return;
    }

    this.http.get<any>(`${this.url}${this.userInp}`).subscribe(
      (data) => {
        if (data.meals) {
          const meal = data.meals[0];
          this.result = meal;
          this.ingredients = [];
          
          let count = 1;
          for (let key in meal) {
            if (key.startsWith('strIngredient') && meal[key]) {
              const ingredient = meal[key];
              const measure = meal[`strMeasure${count}`];
              this.ingredients.push(`${measure} ${ingredient}`);
              count++;
            }
          }
        } else {
          this.result = { error: 'No meals found for the given input.' };
        }
      },
      (error) => {
        console.error('Error fetching the meal data:', error);
        this.result = { error: 'Error fetching the meal data.' };
      }
    );
  }

  // Toggle recipe visibility
  toggleRecipeVisibility() {
    const recipeElement = document.getElementById('recipe');
    if (recipeElement) {
      recipeElement.style.display = recipeElement.style.display === 'none' ? 'block' : 'none';
    }
  }
}
