import { NextRequest } from 'next/server';

export function getClientIP(request: NextRequest): string {
  // Check for forwarded headers first (common in production with proxies)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    const ips = forwarded.split(',').map(ip => ip.trim());
    return ips[0];
  }

  // Check for real IP header
  const realIP = request.headers.get('x-real-ip');
  if (realIP) {
    return realIP;
  }

  // Check for CF-Connecting-IP (Cloudflare)
  const cfIP = request.headers.get('cf-connecting-ip');
  if (cfIP) {
    return cfIP;
  }

  // Fallback to connection remote address
  const connection = request.headers.get('x-connection-remote-addr');
  if (connection) {
    return connection;
  }

  // Last resort - try to get from request connection
  // This is less reliable but provides a fallback
  return 'unknown';
}

export function isAdminEmail(email: string): boolean {
  return email.toLowerCase() === 'christopher.hunt86@gmail.com';
} 