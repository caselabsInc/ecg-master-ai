import type { EcgReport } from '../db';

export type DiagnosticFinding = NonNullable<NonNullable<EcgReport['decisionSupport']>['ruleFindings']>[number];

export type DiagnosticRule = {
  id: string;
  evaluate: (report: Partial<EcgReport>) => DiagnosticFinding[];
};

