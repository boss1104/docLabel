import request from '@/utils/request';

/**
 * Annotation services
 */

export async function queryLabel({ projectId, params }) {
  return request(`/api/projects/${projectId}/labels/`, {
    params,
  });
}
