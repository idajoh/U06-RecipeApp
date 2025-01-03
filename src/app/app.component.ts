import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  userInp: string = '';
  result: any = null;
  isLoggedIn: boolean = false;  // Tracks login state
  url: string = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
  randomRecipeUrl: string = 'https://www.themealdb.com/api/json/v1/1/random.php';
  filterUrl: string = 'https://www.themealdb.com/api/json/v1/1/filter.php?c=';
  ingredients: string[] = [];
  suggestedRecipes: any[] = [];
  selectedRecipe: any = null;
  selectedIngredients: string[] = []; 
  filteredFoods: any[] = [];

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

  // Fetch meals by category directly from the API
  filterFoods(category: string): void {
    this.http.get<{ meals: any[] }>(`${this.filterUrl}${category}`).subscribe(
      (data) => {
        if (data.meals) {
          this.filteredFoods = data.meals;
        } else {
          this.filteredFoods = [];
        }
      },
      (error) => {
        console.error(`Error fetching ${category} meals:`, error);
        this.filteredFoods = [];
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
      recipeElement.style.display =
        recipeElement.style.display === 'none' ? 'block' : 'none';
    }
  }

   // logout method
   logout(): void {
    this.isLoggedIn = false;  
    localStorage.removeItem('isLoggedIn');
  }

  ngOnInit(): void {
    const storedLoginState = localStorage.getItem('isLoggedIn');
  if (storedLoginState) {
    localStorage.setItem('isLoggedIn', 'false'); 
    this.isLoggedIn = false;
  } else if (storedLoginState === 'true') {
    this.isLoggedIn = true;
  }
    this.fetchSuggestedRecipes();
    this.fetchRandomRecipes();
  }
}
