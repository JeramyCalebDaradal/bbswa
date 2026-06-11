import { apiRequest } from './client'

export async function getReports() {
  return apiRequest('/admin/reports')
}

