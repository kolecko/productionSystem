import {ProductionFact} from './fact.model';
import {ProductionRule} from './rule.model';

export class ProductionPattern {
  value: string;
  offset: number;
  continuality: number;
}

export class ProductionSystem {
  patterns = new Map<string, ProductionPattern>();
  interferencePropagated = false;

  facts: ProductionFact[] = [];
  rules: ProductionRule[] = [];
  messages: string[] = [];

  matchExecAddAction(action: string): boolean {
    if (!/^pridat\s/gi.test(action)) {
      return false;
    }

    const text = ProductionFact.substitutePatterns(action, this.patterns);
    if (this.facts.filter(fact => fact.fullText === text).length === 0) {
      if (this.interferencePropagated) {
        console.log('PRIDAT: ' + text);
        return false;
      }

      this.addFact(text);
      return true;
    }

    return false;
  }

  matchExecDeleteAction(action: string): boolean {
    if (!/^vymazat\s/gi.test(action)) {
      return false;
    }

    const text = ProductionFact.substitutePatterns(action, this.patterns);

    if (this.interferencePropagated) {
      console.log('VYMAZAT: ' + text);
      return false;
    }

    this.facts = this.facts.filter(fact => fact.fullText !== text);
    return true;
  }

  matchExecMessageAction(action: string): boolean {
    if (!/^vypisat\s/gi.test(action)) {
      return false;
    }

    const text = ProductionFact.substitutePatterns(action, this.patterns);
    if (this.messages.filter(message => message === text).length === 0) {
      if (this.interferencePropagated) {
        console.log('VYPISAT: ' + text);
        return false;
      }

      this.messages.push(text);
      return true;
    }

    return false;
  }

  matchCondition(factParts: string[], condition: string, offset: number, continuality: number): boolean {
    const conditionParts = condition.split(' ');
    let prodPattern;

    if (factParts.length !== conditionParts.length) {
      return false;
    }

    for (let i = 0; i < factParts.length; i++) {
      if (ProductionRule.matchFactPattern(conditionParts[i])) {
        if (this.patterns.has(conditionParts[i])) {
          const pattern = this.patterns.get(conditionParts[i]);
          if (pattern.offset < offset || (pattern.offset === offset && pattern.continuality === continuality)) {
            if (pattern.value === factParts[i]) {
              continue;
            }
            return false;
          }
        }

        prodPattern = new ProductionPattern();
        prodPattern.value = factParts[i];
        prodPattern.offset = offset;

        this.patterns.set(conditionParts[i], prodPattern);
        continue;
      }

      if (factParts[i] === conditionParts[i]) {
        continue;
      }

      return false;
    }

    return true;
  }

  matchPatternConditions(rule: ProductionRule): boolean {
    let differCondition;
    for (differCondition of rule.differConditions) {
      if (ProductionRule.execDifferCondition(differCondition, this.patterns)) {
        continue;
      }

      return false;
    }

    return true;
  }

  commitActions(rule) {
    let action;
    let propagated = this.interferencePropagated;
    for (action of rule.actions) {
      propagated = this.matchExecAddAction(action) || propagated;
      propagated = this.matchExecDeleteAction(action) || propagated;
      propagated = this.matchExecMessageAction(action) || propagated;
    }

    this.interferencePropagated = this.interferencePropagated || propagated;
  }

  processRule(rule: ProductionRule) {
    const conditionCounter = [];
    for (let i = 0; i < rule.conditions.length; i++) {
      conditionCounter[i] = 0;
    }

    let offset = 0;
    let continuality = 0;

    while (1) {
      for (; conditionCounter[offset] < this.facts.length; conditionCounter[offset]++) {
        if (this.matchCondition(this.facts[conditionCounter[offset]].factParts, rule.conditions[offset], offset, continuality)) {
          if (offset === rule.conditions.length - 1) {
            if (this.matchPatternConditions(rule)) {
              this.commitActions(rule);
            }

            continue;
          }

          offset++;
        }
      }

      if (offset === 0) {
        break;
      }

      conditionCounter[offset] = 0;
      offset--;
      continuality++;
      conditionCounter[offset]++;
    }

    this.patterns.clear();
  }

  processStep() {
    let rule;
    console.clear();

    for (rule of this.rules) {
      this.processRule(rule);
    }

    this.interferencePropagated = false;
  }

  process() {
    this.interferencePropagated = true;
    while (this.interferencePropagated === true) {
      this.interferencePropagated = false;
      let rule;
      console.clear();

      for (rule of this.rules) {
        this.processRule(rule);
      }
    }
    this.interferencePropagated = false;
  }

  addFact(fullText: string) {
    this.facts.push(new ProductionFact(fullText));
  }

  dropFact(index: number) {
    this.facts.splice(index, 1);
  }

  addRule(name: string, condition: string, action: string) {
    this.rules.push(new ProductionRule(name, condition, action));
  }

  dropRule(index: number) {
    this.rules.splice(index, 1);
  }

  clear() {
    this.facts.length = 0;
    this.rules.length = 0;
    this.messages.length = 0;
  }
}
