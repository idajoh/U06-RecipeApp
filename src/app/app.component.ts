import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  userInp: string = ''; 
  result: any = null;
  url: string = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
  randomRecipeUrl: string = 'https://www.themealdb.com/api/json/v1/1/random.php'; 
  ingredients: string[] = [];
  suggestedRecipes: any[] = [];
  selectedRecipe: any = null;
  selectedIngredients: string[] = [];

  constructor(private http: HttpClient) {}

  // Method to capture the input change
  onInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.userInp = inputElement.value;
  }

  // Method to fetch meal data
  fetchMeal(): void {
    if (this.userInp.length === 0) {
      this.result = { error: 'Input Field Cannot be Empty' };
      return;
    }

    this.http.get<{ meals: any[] }>(`${this.url}${this.userInp}`).subscribe(
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

  // Fetch suggested recipes
  fetchSuggestedRecipes(): void {
    this.http.get<{ meals: any[] }>(`${this.url}`).subscribe(
      (data) => {
        if (data.meals) {
          this.suggestedRecipes = data.meals.slice(0, 12); 
        }
      },
      (error) => {
        console.error('Error fetching suggested recipes:', error);
      }
    );
  }

  // Fetch random recipes to show when the page loads
  fetchRandomRecipes(): void {
    this.http.get<{ meals: any[] }>(this.randomRecipeUrl).subscribe(
      (data) => {
        if (data.meals) {
          this.suggestedRecipes = data.meals.slice(0, 12); // Get 12 random meals
        }
      },
      (error) => {
        console.error('Error fetching random recipes:', error);
      }
    );
  }
  

  // Handle selection of suggested recipe
  selectSuggestedRecipe(recipe: any): void {
    this.selectedRecipe = recipe;
    this.selectedIngredients = [];

    let count = 1;
    for (let key in recipe) {
      if (key.startsWith('strIngredient') && recipe[key]) {
        const ingredient = recipe[key];
        const measure = recipe[`strMeasure${count}`];
        this.selectedIngredients.push(`${measure} ${ingredient}`);
        count++;
      }
    }

    // Replace search result with the selected recipe
    this.result = this.selectedRecipe;
    this.ingredients = this.selectedIngredients;
  }

  // Toggle recipe visibility
  toggleRecipeVisibility(): void {
    const recipeElement = document.getElementById('recipe');
    if (recipeElement) {
      recipeElement.style.display = recipeElement.style.display === 'none' ? 'block' : 'none';
    }
  }

  ngOnInit(): void {
    this.fetchSuggestedRecipes();
    this.fetchRandomRecipes();  
  }
}
