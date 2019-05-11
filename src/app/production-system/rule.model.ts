import {ProductionPattern} from './production-system.model';

export class ProductionRule {
  private _name: string;

  get name() {
    return this._name;
  }

  private _conditions: string[] = [];
  private _differConditions: string[] = [];

  get conditions() {
    return this._conditions;
  }

  get differConditions() {
    return this._differConditions;
  }

  private _conditionFullText: string;

  get conditionFullText() {
    return this._conditionFullText;
  }

  private _actions: string[];

  get actions() {
    return this._actions;
  }

  private _actionFullText: string;

  get actionFullText() {
    return this._actionFullText;
  }

  private set condition(conditionFullText: string) {
    const conditions = conditionFullText.split(' ^ ');
    let condition;

    for (condition of conditions) {
      if (
        ProductionRule.matchDifferCondition(condition)
      ) {
        this.differConditions.push(condition);
        continue;
      }

      this.conditions.push(condition);
    }

    this._conditionFullText = conditionFullText;
  }

  private set action(actionFullText: string) {
    this._actions = actionFullText.split(' & ');
    this._actionFullText = actionFullText;
  }

  static matchFactPattern(rulePart: string) {
    return /^\$[a-z]+/gi.test(rulePart);
  }

  /**
   * Handling differ condition type with following:
   * match
   * exec
   */
  static matchDifferCondition(rulePart: string): boolean {
    return /^<>\s/gi.test(rulePart);
  }

  static execDifferCondition(differCondition: string, patterns: Map<string, ProductionPattern>): boolean {
    const conditionParts = differCondition.split(' ').splice(1);

    if (ProductionRule.matchFactPattern(conditionParts[0])) {
      conditionParts[0] = patterns.get(conditionParts[0]).value;
    }

    if (ProductionRule.matchFactPattern(conditionParts[1])) {
      conditionParts[1] = patterns.get(conditionParts[1]).value;
    }

    return conditionParts[0] !== conditionParts[1];
  }

  constructor (name: string, conditionFullText: string, actionFullText: string) {
    this._name = name;
    this.condition = conditionFullText;
    this.action = actionFullText;
  }
}
