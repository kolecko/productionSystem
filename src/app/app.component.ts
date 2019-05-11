import { Component } from '@angular/core';
import {ProductionSystem} from './production-system/production-system.model';
import {familyRelations} from './production-system/example';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  /*  Input for single fact to be added. */
  factInput: string;

  /* Input for rule parts to be added */
  ruleNameInput: string;
  ruleConditionInput: string;
  ruleActionInput: string;
  productionSystem: ProductionSystem = new ProductionSystem();

  addFact() {
    this.productionSystem.addFact(this.factInput);
    this.factInput = '';
  }

  dropFact(index: number) {
    this.productionSystem.dropFact(index);
  }

  step() {
    this.productionSystem.processStep();
  }

  interfere() {
    this.productionSystem.process();
  }

  addRule() {
    this.productionSystem.addRule(
      this.ruleNameInput,
      this.ruleConditionInput,
      this.ruleActionInput
    );

    this.ruleNameInput = '';
    this.ruleConditionInput = '';
    this.ruleActionInput = '';
  }

  dropRule(index: number) {
    this.productionSystem.dropRule(index);
  }

  loadSetFamilyRelations() {
    let fact;
    this.clear();
    for (fact of familyRelations.facts) {
      this.factInput = fact;
      this.addFact();
    }

    let pseudoRule;
    for (pseudoRule of familyRelations.rules) {
      this.productionSystem.addRule(pseudoRule.name, pseudoRule.condition, pseudoRule.action);
    }
  }

  clear() {
    this.productionSystem.clear();
  }
}
