import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEditClassificationComponent } from './add-edit-classification.component';

describe('AddEditClassificationComponent', () => {
  let component: AddEditClassificationComponent;
  let fixture: ComponentFixture<AddEditClassificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditClassificationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddEditClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
