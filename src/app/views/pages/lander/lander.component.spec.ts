import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonModule, CardModule, FormModule, GridModule } from '@coreui/angular';
import { LanderComponent } from './lander.component';
import { IconModule } from '@coreui/icons-angular';
import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from '../../../icons/icon-subset';

describe('LanderComponent', () => {
  let component: LanderComponent;
  let fixture: ComponentFixture<LanderComponent>;
  let iconSetService: IconSetService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LanderComponent ],
      imports: [FormModule, CardModule, GridModule, ButtonModule, IconModule],
      providers: [IconSetService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    iconSetService = TestBed.inject(IconSetService);
    iconSetService.icons = { ...iconSubset };

    fixture = TestBed.createComponent(LanderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
