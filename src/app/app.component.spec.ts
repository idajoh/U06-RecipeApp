import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'; // Import for HTTP testing
import { AppComponent } from './app.component';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController); 
  });

  afterEach(() => {
    httpMock.verify(); 
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });


  it('should render title', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, recipe-app');
  });

  it('should call fetchMeal method when search button is clicked', () => {
    spyOn(app, 'fetchMeal'); 

    const button = fixture.debugElement.query(By.css('button'));
    button.triggerEventHandler('click', null); 

    expect(app.fetchMeal).toHaveBeenCalled(); 
  });

  it('should display error message when fetchMeal returns no results', () => {
    app.userInp = 'InvalidMeal';
    app.fetchMeal();

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.error')?.textContent).toContain('No meals found for the given input.');
  });

  it('should fetch meal data correctly when fetchMeal is called', () => {
    const mockMealResponse = {
      meals: [
        {
          strMeal: 'Spaghetti Carbonara',
          strMealThumb: 'https://www.themealdb.com/images/media/meals/58o0se1606764853.jpg',
          strInstructions: 'Cook pasta, make sauce...',
          strArea: 'Italian',
        },
      ],
    };

    app.userInp = 'Carbonara';
    app.fetchMeal();

    const req = httpMock.expectOne('https://www.themealdb.com/api/json/v1/1/search.php?s=Carbonara');
    expect(req.request.method).toBe('GET');
    req.flush(mockMealResponse); 

    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.meal-details h2')?.textContent).toContain('Spaghetti Carbonara');
  });

  it('should toggle recipe visibility when the button is clicked', () => {
    app.result = {
      strMeal: 'Spaghetti Carbonara',
      strMealThumb: 'https://www.themealdb.com/images/media/meals/58o0se1606764853.jpg',
      strInstructions: 'Cook pasta, make sauce...',
      strArea: 'Italian',
    };

    fixture.detectChanges();
    const showRecipeButton = fixture.debugElement.query(By.css('#show-recipe'));
    const recipeElement = fixture.debugElement.query(By.css('#recipe'));

    expect(recipeElement.nativeElement.style.display).toBe('none'); 

    showRecipeButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(recipeElement.nativeElement.style.display).toBe('block'); 

    const hideRecipeButton = fixture.debugElement.query(By.css('#hide-recipe'));
    hideRecipeButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(recipeElement.nativeElement.style.display).toBe('none'); 
  });

  it('should fetch suggested recipes when ngOnInit is called', () => {
    const mockSuggestedRecipesResponse = {
      meals: [
        {
          strMeal: 'Spaghetti Carbonara',
          strMealThumb: 'https://www.themealdb.com/images/media/meals/58o0se1606764853.jpg',
        },
      ],
    };

    app.ngOnInit();

    const req = httpMock.expectOne('https://www.themealdb.com/api/json/v1/1/search.php?s=');
    expect(req.request.method).toBe('GET');
    req.flush(mockSuggestedRecipesResponse);

    expect(app.suggestedRecipes.length).toBeGreaterThan(0); 
  });
});
