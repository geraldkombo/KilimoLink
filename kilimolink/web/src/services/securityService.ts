/**
 * Security & Integrity Service
 * Simulates high-level administrative oversight and system health monitoring.
 * Grounded in 'security-best-practices' skill.
 */

export interface SecurityLog {
  id: number;
  action: string;
  status: 'SUCCESS' | 'MITIGATED' | 'WARNING' | 'CRITICAL';
  time: string;
  details: string;
}

class SecurityService {
  private logs: SecurityLog[] = [
    { id: 1, action: 'JWT Rotation', status: 'SUCCESS', time: '2 mins ago', details: 'Automated 24h key rotation successful.' },
    { id: 2, action: 'Rate Limit Trigger', status: 'MITIGATED', time: '1 hour ago', details: 'Burst of 500 requests from IP 192.168.1.1 throttled.' },
    { id: 3, action: 'DTO Validation Pass', status: 'SUCCESS', time: 'Continuous', details: 'Strict schema enforcement active on all /api/v1 endpoints.' },
    { id: 4, action: 'XSS Attempt Blocked', status: 'MITIGATED', time: '3 hours ago', details: 'Malicious script injection detected in Product Title field.' },
  ];

  getHealthScore(): number {
    // Logic to calculate health based on recent logs
    const criticals = this.logs.filter(l => l.status === 'CRITICAL').length;
    const warnings = this.logs.filter(l => l.status === 'WARNING').length;
    return Math.max(0, 100 - (criticals * 50) - (warnings * 10));
  }

  getLogs(): SecurityLog[] {
    return [...this.logs].sort((a, b) => b.id - a.id);
  }

  addLog(action: string, status: SecurityLog['status'], details: string) {
    const newLog: SecurityLog = {
      id: Date.now(),
      action,
      status,
      time: 'Just now',
      details
    };
    this.logs.unshift(newLog);
    if (this.logs.length > 20) this.logs.pop();
  }
}

export const securityService = new SecurityService();
