import {ProductionPattern} from './production-system.model';
import {ProductionRule} from './rule.model';

export class ProductionFact {
  private _fullText: string;
  private _factParts: string[];

  get factParts() {
    return this._factParts;
  }

  get fullText() {
    return this._fullText;
  }

  static substitutePatterns(text: string, patterns: Map<string, ProductionPattern>): string {
    let parts = text.split(' ').splice(1);
    parts = parts.map(part => {
      if (ProductionRule.matchFactPattern(part)) {
        return patterns.get(part).value;
      }
      return part;
    });

    return parts.join(' ');
  }

  constructor(value: string) {
    this._factParts = value.split(' ');
    this._fullText = value;
  }
}
